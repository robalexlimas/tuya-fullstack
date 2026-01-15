import { useMemo } from "react";
import Button from "@components/ui/Button";
import Input from "@components/ui/Input";
import type { Card } from "@models/cards.model";
import type { PaymentFormMode } from "@models/payments.model";

type Props = {
    cards: Card[];
    mode: PaymentFormMode;
    isSubmitting: boolean;
    error?: string | null;
    onModeChange: (m: PaymentFormMode) => void;
    onSubmit: (payload: any) => void;
};

export default function PaymentForm({
    cards,
    mode,
    isSubmitting,
    error,
    onModeChange,
    onSubmit,
}: Props) {
    const title = useMemo(() => {
        if (mode === "PAYMENT") return "Registrar pago";
        if (mode === "PURCHASE") return "Registrar compra";
        return "Registrar reembolso";
    }, [mode]);

    return (
        <div className="space-y-4">
            <div className="bg-tuya-white rounded-2xl shadow border border-black/5 p-6">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold">{title}</h1>
                        <p className="text-sm text-black/60 mt-1">
                            Selecciona la tarjeta y registra el movimiento.
                        </p>
                    </div>

                    <div className="flex gap-2">
                        <Button
                            variant={mode === "PAYMENT" ? "primary" : "ghost"}
                            onClick={() => onModeChange("PAYMENT")}
                            type="button"
                        >
                            Pago
                        </Button>
                    </div>
                </div>
            </div>

            <div className="bg-tuya-white rounded-2xl shadow border border-black/5 p-6">
                <form
                    className="space-y-4"
                    onSubmit={(e) => {
                        e.preventDefault();
                        const fd = new FormData(e.currentTarget);

                        const payload: any = {
                            cardId: String(fd.get("cardId") ?? ""),
                            amount: Number(fd.get("amount") ?? 0),
                            currency: String(fd.get("currency") ?? "USD"),
                            description: String(fd.get("description") ?? ""),
                        };

                        if (mode !== "PAYMENT") {
                            payload.merchant = String(fd.get("merchant") ?? "");
                        }

                        onSubmit(payload);
                    }}
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-1 md:col-span-2">
                            <label className="text-xs font-medium text-black/70">Tarjeta</label>
                            <select
                                name="cardId"
                                required
                                className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm
                           outline-none transition focus:border-tuya-red focus:ring-2 focus:ring-tuya-red/20"
                            >
                                <option value="">Selecciona una tarjeta</option>
                                {cards.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.nickname ? `${c.nickname} • ` : ""}
                                        {c.brand} •••• {c.last4} (Disp: ${c.availableCredit.toFixed(2)})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-medium text-black/70">Monto</label>
                            <Input
                                name="amount"
                                type="number"
                                min={0.01}
                                step="0.01"
                                required
                                placeholder="100.00"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-medium text-black/70">Moneda</label>
                            <Input name="currency" defaultValue="USD" />
                        </div>

                        {mode !== "PAYMENT" ? (
                            <div className="space-y-1 md:col-span-2">
                                <label className="text-xs font-medium text-black/70">Merchant</label>
                                <Input name="merchant" placeholder="Amazon / Spotify / etc." />
                            </div>
                        ) : null}

                        <div className="space-y-1 md:col-span-2">
                            <label className="text-xs font-medium text-black/70">Descripción</label>
                            <Input name="description" placeholder="Detalle del movimiento" />
                        </div>
                    </div>

                    {error ? (
                        <div className="rounded-xl bg-tuya-red/10 text-tuya-red text-sm px-3 py-2">
                            {error}
                        </div>
                    ) : null}

                    <div className="flex justify-end gap-2 pt-2">
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Procesando..." : "Registrar"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
