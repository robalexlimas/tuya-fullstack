import type { Card } from "@models/cards.model";
import type { TxStatus } from "@models/transactions.model";
import Button from "@components/ui/Button";

type Props = {
    cards: Card[];
    cardId?: string;
    status?: TxStatus | "";
    onChange: (next: { cardId?: string; status?: TxStatus | "" }) => void;
    onReset: () => void;
    onRefresh: () => void;
    isLoading?: boolean;
};

export default function TransactionsFilters({
    cards,
    cardId,
    status,
    onChange,
    onReset,
    onRefresh,
    isLoading,
}: Props) {
    return (
        <div className="bg-tuya-white rounded-2xl shadow border border-black/5 p-6">
            <div className="flex flex-col md:flex-row md:items-end gap-3 justify-between">
                <div>
                    <h1 className="text-2xl font-semibold">Transacciones</h1>
                    <p className="text-sm text-black/60 mt-1">
                        Historial de movimientos (pagos).
                    </p>
                </div>

                <div className="flex gap-2">
                    <Button variant="ghost" onClick={onReset} type="button">
                        Limpiar filtros
                    </Button>
                    <Button onClick={onRefresh} disabled={isLoading} type="button">
                        {isLoading ? "Cargando..." : "Actualizar"}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
                <div className="space-y-1">
                    <label className="text-xs font-medium text-black/70">Tarjeta</label>
                    <select
                        value={cardId ?? ""}
                        onChange={(e) => onChange({ cardId: e.target.value || "", status })}
                        className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm
                       outline-none transition focus:border-tuya-red focus:ring-2 focus:ring-tuya-red/20"
                    >
                        <option value="">Todas</option>
                        {cards.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.nickname ? `${c.nickname} • ` : ""}
                                {c.brand} •••• {c.last4}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-medium text-black/70">Estado</label>
                    <select
                        value={status ?? ""}
                        onChange={(e) => onChange({ cardId, status: (e.target.value as any) || "" })}
                        className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm
                       outline-none transition focus:border-tuya-red focus:ring-2 focus:ring-tuya-red/20"
                    >
                        <option value="">Todos</option>
                        <option value="PENDING">PENDING</option>
                        <option value="COMPLETED">COMPLETED</option>
                        <option value="FAILED">FAILED</option>
                    </select>
                </div>
            </div>
        </div>
    );
}
