import { useEffect, useMemo, useState } from "react";
import StatCard from "../components/StatCard";
import LatestTransactions from "../components/LatestTransactions";

import { dashboardApi } from "@api/dashboard.api";
import { cardsApi } from "@api/cards.api";

import { mapBackendSummaryToSummary } from "@mappers/dashboard.mapper";
import { mapBackendCardToCard } from "@mappers/cards.mapper";
import { mapBackendTxToTx } from "@mappers/transactions.mapper";

import type { UserSummary } from "@models/dashboard.model";
import type { Card } from "@models/cards.model";
import type { Transaction } from "@models/transactions.model";

const money = (n: number) =>
    n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function DashboardContainer() {
    const [summary, setSummary] = useState<UserSummary | null>(null);
    const [cards, setCards] = useState<Card[]>([]);
    const [latest, setLatest] = useState<Transaction[]>([]);
    const [isLoading, setLoading] = useState(true);

    const load = async () => {
        setLoading(true);
        try {
            const [summaryDto, cardsDto, txDto] = await Promise.all([
                dashboardApi.summary(),
                cardsApi.list(),
                dashboardApi.latestTransactions(),
            ]);

            setSummary(mapBackendSummaryToSummary(summaryDto));
            setCards(cardsDto.map(mapBackendCardToCard));
            setLatest(txDto.map(mapBackendTxToTx).slice(0, 8));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    const activeCards = useMemo(
        () => cards.filter((c) => c.status === "ACTIVE").length,
        [cards]
    );

    const totalAvailable = useMemo(
        () => cards.reduce((acc, c) => acc + (c.availableCredit ?? 0), 0),
        [cards]
    );

    const totalLimit = useMemo(
        () => cards.reduce((acc, c) => acc + (c.creditLimit ?? 0), 0),
        [cards]
    );

    return (
        <div className="space-y-4">
            <div className="bg-tuya-white rounded-2xl shadow border border-black/5 p-6">
                <h1 className="text-2xl font-semibold">Dashboard</h1>
                <p className="text-sm text-black/60 mt-1">
                    Resumen general de tu actividad.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard
                    label="Tarjetas activas"
                    value={isLoading ? "—" : String(activeCards)}
                    hint=""
                />
                <StatCard
                    label="Crédito disponible total"
                    value={isLoading ? "—" : `$${money(totalAvailable)}`}
                    hint={`Límite total: $${money(totalLimit)}`}
                />
                <StatCard
                    label="Pagos (cantidad)"
                    value={isLoading || !summary ? "—" : String(summary.totalPayments)}
                    hint={isLoading || !summary ? "" : `Monto: $${money(summary.totalPaymentsAmount)}`}
                />
            </div>

            <LatestTransactions items={latest} isLoading={isLoading} />
        </div>
    );
}
