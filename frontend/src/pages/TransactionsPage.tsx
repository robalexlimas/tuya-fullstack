import Card from "@components/ui/Card";

export default function TransactionsPage() {
    return (
        <Card className="p-6">
            <h1 className="text-2xl font-semibold">Transacciones</h1>
            <p className="text-sm text-black/60 mt-2">
                Aquí irá el historial y filtros por tarjeta/estado/tipo.
            </p>
        </Card>
    );
}
