import type { Card } from "@models/cards.model";
import Button from "@components/ui/Button";
import CardUI from "@components/ui/Card";

type Props = {
    items: Card[];
    onCreate: () => void;
    onEdit: (card: Card) => void;
    onDelete: (card: Card) => void;
    isLoading?: boolean;
};

export default function CardsTable({
    items,
    onCreate,
    onEdit,
    onDelete,
    isLoading,
}: Props) {
    return (
        <div className="space-y-4">
            <CardUI className="p-6 flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold">Tarjetas</h1>
                    <p className="text-sm text-black/60 mt-1">
                        Administra tus tarjetas (crear, editar, eliminar).
                    </p>
                </div>

                <Button onClick={onCreate}>Nueva tarjeta</Button>
            </CardUI>

            <CardUI className="p-0 overflow-hidden">
                <div className="px-6 py-4 border-b border-black/5 flex items-center justify-between">
                    <div className="text-sm font-medium">Listado</div>
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
                                <th className="text-left font-medium px-6 py-3">Nick</th>
                                <th className="text-left font-medium px-6 py-3">Marca</th>
                                <th className="text-left font-medium px-6 py-3">Últimos 4</th>
                                <th className="text-left font-medium px-6 py-3">Expira</th>
                                <th className="text-left font-medium px-6 py-3">Límite</th>
                                <th className="text-left font-medium px-6 py-3">Disponible</th>
                                <th className="text-left font-medium px-6 py-3">Estado</th>
                                <th className="text-right font-medium px-6 py-3">Acciones</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-black/5">
                            {items.map((c) => (
                                <tr key={c.id} className="hover:bg-black/[0.015]">
                                    <td className="px-6 py-4">
                                        {c.nickname ? (
                                            <span className="font-medium">{c.nickname}</span>
                                        ) : (
                                            <span className="text-black/50">—</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">{c.brand}</td>
                                    <td className="px-6 py-4 font-mono">•••• {c.last4}</td>
                                    <td className="px-6 py-4">
                                        {String(c.expMonth).padStart(2, "0")}/{c.expYear}
                                    </td>
                                    <td className="px-6 py-4">${c.creditLimit.toFixed(2)}</td>
                                    <td className="px-6 py-4">${c.availableCredit.toFixed(2)}</td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={[
                                                "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium",
                                                c.status === "ACTIVE" && "bg-tuya-green/20 text-tuya-black",
                                                c.status === "BLOCKED" && "bg-tuya-orange/20 text-tuya-black",
                                                c.status === "CLOSED" && "bg-black/10 text-black/70",
                                            ]
                                                .filter(Boolean)
                                                .join(" ")}
                                        >
                                            {c.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" onClick={() => onEdit(c)}>
                                                Editar
                                            </Button>
                                            <Button
                                                variant="secondary"
                                                onClick={() => onDelete(c)}
                                                className="bg-tuya-black hover:bg-tuya-red"
                                            >
                                                Eliminar
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {!isLoading && items.length === 0 ? (
                                <tr>
                                    <td className="px-6 py-10 text-center text-black/50" colSpan={8}>
                                        No tienes tarjetas aún. Crea la primera.
                                    </td>
                                </tr>
                            ) : null}
                        </tbody>
                    </table>
                </div>
            </CardUI>
        </div>
    );
}
