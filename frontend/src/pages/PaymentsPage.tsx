import Card from "@components/ui/Card";

export default function PaymentsPage() {
    return (
        <Card className="p-6">
            <h1 className="text-2xl font-semibold">Pagos</h1>
            <p className="text-sm text-black/60 mt-2">
                Aquí irá el flujo para pagar usando una tarjeta.
            </p>
        </Card>
    );
}
