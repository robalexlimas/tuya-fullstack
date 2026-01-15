import Card from "@components/ui/Card";

export default function CardsPage() {
    return (
        <Card className="p-6">
            <h1 className="text-2xl font-semibold">Tarjetas</h1>
            <p className="text-sm text-black/60 mt-2">
                Aquí irá el CRUD de tarjetas (crear, editar, eliminar).
            </p>
        </Card>
    );
}
