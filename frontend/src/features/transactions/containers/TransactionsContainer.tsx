import { useEffect, useState } from "react";
import TransactionsFilters from "../components/TransactionsFilters";
import TransactionsTable from "../components/TransactionsTable";

import type { Card } from "@models/cards.model";
import type { Transaction, TxStatus } from "@models/transactions.model";

import { cardsApi } from "@api/cards.api";
import { transactionsApi } from "@api/transactions.api";

import { mapBackendCardToCard } from "@mappers/cards.mapper";
import { mapBackendTxToTx } from "@mappers/transactions.mapper";

export default function TransactionsContainer() {
    const [cards, setCards] = useState<Card[]>([]);
    const [items, setItems] = useState<Transaction[]>([]);
    const [isLoading, setLoading] = useState(true);

    const [cardId, setCardId] = useState<string>("");
    const [status, setStatus] = useState<TxStatus | "">("");

    const loadCards = async () => {
        const dto = await cardsApi.list();
        setCards(dto.map(mapBackendCardToCard));
    };

    const loadTransactions = async (opts?: { cardId?: string; status?: TxStatus | "" }) => {
        setLoading(true);
        try {
            const dto = await transactionsApi.list({
                cardId: opts?.cardId || cardId || undefined,
                status: (opts?.status || status || undefined) as any,
            });
            setItems(dto.map(mapBackendTxToTx));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCards();
        loadTransactions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onChangeFilters = (next: { cardId?: string; status?: TxStatus | "" }) => {
        const nextCard = next.cardId ?? cardId;
        const nextStatus = next.status ?? status;
        setCardId(nextCard || "");
        setStatus(nextStatus || "");
        loadTransactions({ cardId: nextCard || "", status: nextStatus || "" });
    };

    const onReset = () => {
        setCardId("");
        setStatus("");
        loadTransactions({ cardId: "", status: "" });
    };

    const onFinalize = async (tx: Transaction, newStatus: "COMPLETED" | "FAILED") => {
        const ok = confirm(`¿Cambiar estado a ${newStatus} para ${tx.type} ${tx.id}?`);
        if (!ok) return;

        try {
            const updated = await transactionsApi.finalize(tx.id, { newStatus });
            const mapped = mapBackendTxToTx(updated);

            setItems((prev) => prev.map((x) => (x.id === mapped.id ? mapped : x)));

            // refrescar tarjetas por si el backend ajusta AvailableCredit al fallar/complete
            await loadCards();
        } catch (e: any) {
            alert(
                e?.response?.data?.message ||
                e?.response?.data?.title ||
                "No se pudo finalizar la transacción."
            );
        }
    };

    return (
        <div className="space-y-4">
            <TransactionsFilters
                cards={cards}
                cardId={cardId}
                status={status}
                onChange={onChangeFilters}
                onReset={onReset}
                onRefresh={() => loadTransactions()}
                isLoading={isLoading}
            />

            <TransactionsTable
                items={items}
                isLoading={isLoading}
                onFinalize={onFinalize}
            />
        </div>
    );
}
