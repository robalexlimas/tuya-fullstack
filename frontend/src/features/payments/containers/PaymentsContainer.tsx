import { useEffect, useState } from "react";
import PaymentForm from "../components/PaymentForm";
import PaymentResultCard from "../components/PaymentResultCard";
import type { Card } from "@models/cards.model";
import type { PaymentFormMode, Transaction } from "@models/payments.model";
import { cardsApi } from "@api/cards.api";
import { paymentsApi } from "@api/payments.api";
import { mapBackendCardToCard } from "@mappers/cards.mapper";
import { mapBackendTransactionToTransaction } from "@mappers/payments.mapper";

export default function PaymentsContainer() {
    const [cards, setCards] = useState<Card[]>([]);
    const [mode, setMode] = useState<PaymentFormMode>("PAYMENT");
    const [isSubmitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [lastTx, setLastTx] = useState<Transaction | null>(null);

    const loadCards = async () => {
        const dto = await cardsApi.list();
        setCards(dto.map(mapBackendCardToCard));
    };

    useEffect(() => {
        loadCards();
    }, []);

    const submit = async (payload: any) => {
        setSubmitting(true);
        setError(null);
        setLastTx(null);

        try {
            // Validación rápida frontend
            if (!payload.cardId) throw new Error("Selecciona una tarjeta.");
            if (!payload.amount || payload.amount <= 0) throw new Error("Monto inválido.");

            let dto;
            if (mode === "PAYMENT") dto = await paymentsApi.createPayment(payload);
            else throw new Error("Modo de pago inválido.");

            const mapped = mapBackendTransactionToTransaction(dto);
            setLastTx(mapped);

            // refrescar cards (para reflejar AvailableCredit actualizado)
            await loadCards();
        } catch (e: any) {
            const msg =
                e?.response?.data?.message ||
                e?.response?.data?.title ||
                e?.message ||
                "No se pudo procesar el pago.";
            setError(msg);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-4">
            <PaymentForm
                cards={cards}
                mode={mode}
                isSubmitting={isSubmitting}
                error={error}
                onModeChange={setMode}
                onSubmit={submit}
            />

            <PaymentResultCard tx={lastTx} />
        </div>
    );
}
