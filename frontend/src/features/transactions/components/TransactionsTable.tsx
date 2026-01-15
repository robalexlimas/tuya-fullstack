import type { Transaction } from "@models/transactions.model";
import CardUI from "@components/ui/Card";

type Props = {
    items: Transaction[];
    isLoading?: boolean;
    onFinalize: (tx: Transaction, newStatus: "COMPLETED" | "FAILED") => void;
    onOpenHistory?: (tx: Transaction) => void;
};

function badgeClass(status: string) {
    if (status === "COMPLETED") return "bg-tuya-green/20 text-tuya-black";
    if (status === "PENDING") return "bg-tuya-orange/20 text-tuya-black";
    return "bg-tuya-red/10 text-tuya-red";
}

function typePill(type: string) {
    if (type === "PAYMENT") return "bg-black/10 text-black/70";
    if (type === "PURCHASE") return "bg-tuya-red/10 text-tuya-red";
    return "bg-tuya-green/20 text-tuya-black";
}

export default function TransactionsTable({
    items,
    isLoading,
}: Props) {
    return (
        <CardUI className="p-0 overflow-hidden">
            <div className="px-6 py-4 border-b border-black/5 flex items-center justify-between">
                <div className="text-sm font-medium">Historial</div>
                {isLoading ? (
                    <div className="text-xs text-black/50">Cargando...</div>
                ) : (
                    <div className="text-xs text-black/50">{items.length} items</div>
                )}
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                    <thead className="bg-black/[0.02] text-black/60">
                        <tr>
                            <th className="text-left font-medium px-6 py-3">Tipo</th>
                            <th className="text-left font-medium px-6 py-3">Monto</th>
                            <th className="text-left font-medium px-6 py-3">Estado</th>
                            <th className="text-left font-medium px-6 py-3">Descripción</th>
                            <th className="text-left font-medium px-6 py-3">Fecha</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-black/5">
                        {items.map((tx) => (
                            <tr key={tx.id} className="hover:bg-black/[0.015]">
                                <td className="px-6 py-4">
                                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${typePill(tx.type)}`}>
                                        {tx.type}
                                    </span>
                                </td>

                                <td className="px-6 py-4">
                                    <span className="font-medium">
                                        {tx.currency} {tx.amount.toFixed(2)}
                                    </span>
                                </td>

                                <td className="px-6 py-4">
                                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${badgeClass(tx.status)}`}>
                                        {tx.status}
                                    </span>
                                </td>

                                <td className="px-6 py-4">{tx.description ?? <span className="text-black/40">—</span>}</td>

                                <td className="px-6 py-4 text-black/60">
                                    {new Date(tx.createdAtUtc).toLocaleString()}
                                </td>
                            </tr>
                        ))}

                        {!isLoading && items.length === 0 ? (
                            <tr>
                                <td className="px-6 py-10 text-center text-black/50" colSpan={7}>
                                    No hay transacciones con estos filtros.
                                </td>
                            </tr>
                        ) : null}
                    </tbody>
                </table>
            </div>
        </CardUI>
    );
}
