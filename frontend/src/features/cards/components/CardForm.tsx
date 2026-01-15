import Button from "@components/ui/Button";
import Input from "@components/ui/Input";
import type { Card, CardStatus } from "@models/cards.model";

type Mode = "create" | "edit";

type Props = {
    mode: Mode;
    initial?: Card | null;
    isSubmitting: boolean;
    error?: string | null;
    onCancel: () => void;
    onSubmit: (values: any) => void;
};

export default function CardForm({
    mode,
    initial,
    isSubmitting,
    error,
    onCancel,
    onSubmit,
}: Props) {
    const isEdit = mode === "edit";

    return (
        <form
            className="space-y-4"
            onSubmit={(e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);

                const payload: any = {
                    brand: String(fd.get("brand") ?? ""),
                    last4: String(fd.get("last4") ?? ""),
                    expMonth: Number(fd.get("expMonth") ?? 0),
                    expYear: Number(fd.get("expYear") ?? 0),
                    creditLimit: Number(fd.get("creditLimit") ?? 0),
                    nickname: String(fd.get("nickname") ?? ""),
                    status: String(fd.get("status") ?? "ACTIVE") as CardStatus,
                };

                // En edit no mandamos last4/creditLimit si tu backend no lo permite
                if (isEdit) {
                    delete payload.last4;
                    delete payload.creditLimit;
                }

                onSubmit(payload);
            }}
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1 md:col-span-2">
                    <label className="text-xs font-medium text-black/70">Nickname</label>
                    <Input name="nickname" defaultValue={initial?.nickname ?? ""} />
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-medium text-black/70">Marca</label>
                    <Input name="brand" required defaultValue={initial?.brand ?? ""} />
                </div>

                {!isEdit ? (
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-black/70">Últimos 4</label>
                        <Input
                            name="last4"
                            required
                            inputMode="numeric"
                            maxLength={4}
                            placeholder="1234"
                        />
                    </div>
                ) : (
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-black/70">Últimos 4</label>
                        <Input value={`•••• ${initial?.last4 ?? "----"}`} disabled />
                    </div>
                )}

                <div className="space-y-1">
                    <label className="text-xs font-medium text-black/70">Mes exp.</label>
                    <Input
                        name="expMonth"
                        type="number"
                        min={1}
                        max={12}
                        required
                        defaultValue={initial?.expMonth ?? 1}
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-medium text-black/70">Año exp.</label>
                    <Input
                        name="expYear"
                        type="number"
                        min={2026}
                        required
                        defaultValue={initial?.expYear ?? new Date().getFullYear()}
                    />
                </div>

                {!isEdit ? (
                    <div className="space-y-1 md:col-span-2">
                        <label className="text-xs font-medium text-black/70">Límite</label>
                        <Input
                            name="creditLimit"
                            type="number"
                            min={0}
                            step="0.01"
                            required
                            defaultValue={0}
                        />
                    </div>
                ) : null}

                {isEdit ? (
                    <div className="space-y-1 md:col-span-2">
                        <label className="text-xs font-medium text-black/70">Estado</label>
                        <select
                            name="status"
                            defaultValue={initial?.status ?? "ACTIVE"}
                            className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm
                         outline-none transition focus:border-tuya-red focus:ring-2 focus:ring-tuya-red/20"
                        >
                            <option value="ACTIVE">ACTIVE</option>
                            <option value="BLOCKED">BLOCKED</option>
                            <option value="CLOSED">CLOSED</option>
                        </select>
                    </div>
                ) : null}
            </div>

            {error ? (
                <div className="rounded-xl bg-tuya-red/10 text-tuya-red text-sm px-3 py-2">
                    {error}
                </div>
            ) : null}

            <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="ghost" onClick={onCancel}>
                    Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Guardando..." : isEdit ? "Guardar cambios" : "Crear"}
                </Button>
            </div>
        </form>
    );
}
