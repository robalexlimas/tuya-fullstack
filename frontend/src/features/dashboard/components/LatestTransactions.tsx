import Card from "@components/ui/Card";
import type { Transaction } from "@models/transactions.model";

type Props = {
    items: Transaction[];
    isLoading?: boolean;
};

function badge(status: string) {
    if (status === "COMPLETED") return "bg-tuya-green/20";
    if (status === "PENDING") return "bg-tuya-orange/20";
    return "bg-tuya-red/10";
}

export default function LatestTransactions({ items, isLoading }: Props) {
    return (
        <Card className="p-0 overflow-hidden">
            <div className="px-6 py-4 border-b border-black/5 flex items-center justify-between">
                <div className="text-sm font-medium">Últimas transacciones</div>
                <div className="text-xs text-black/50">
                    {isLoading ? "Cargando..." : `${items.length} items`}
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                    <thead className="bg-black/[0.02] text-black/60">
                        <tr>
                            <th className="text-left font-medium px-6 py-3">Tipo</th>
                            <th className="text-left font-medium px-6 py-3">Monto</th>
                            <th className="text-left font-medium px-6 py-3">Estado</th>
                            <th className="text-left font-medium px-6 py-3">Fecha</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-black/5">
                        {!isLoading && items.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-10 text-center text-black/50">
                                    Aún no hay transacciones.
                                </td>
                            </tr>
                        ) : null}

                        {items.map((tx) => (
                            <tr key={tx.id} className="hover:bg-black/[0.015]">
                                <td className="px-6 py-4">
                                    <span className="text-xs font-medium rounded-full px-2 py-1 bg-black/10 text-black/70">
                                        {tx.type}
                                    </span>
                                </td>
                                <td className="px-6 py-4 font-medium">
                                    {tx.currency} {tx.amount.toFixed(2)}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${badge(tx.status)}`}>
                                        {tx.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-black/60">
                                    {new Date(tx.createdAtUtc).toLocaleString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
}
