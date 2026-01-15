import CardUI from "@components/ui/Card";
import type { Transaction } from "@models/payments.model";

type Props = {
    tx: Transaction | null;
};

export default function PaymentResultCard({ tx }: Props) {
    if (!tx) return null;

    return (
        <CardUI className="p-6">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <div className="text-xs text-black/50">Transacción creada</div>
                    <div className="text-lg font-semibold mt-1">
                        {tx.type} • {tx.status}
                    </div>
                    <div className="text-sm text-black/60 mt-1">
                        {tx.currency} {tx.amount.toFixed(2)}
                    </div>
                    {tx.description ? (
                        <div className="text-sm text-black/60 mt-1">{tx.description}</div>
                    ) : null}
                </div>

                <div className="text-xs text-black/50 font-mono">
                    {tx.id}
                </div>
            </div>
        </CardUI>
    );
}
