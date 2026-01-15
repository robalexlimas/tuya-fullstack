import Card from "@components/ui/Card";

export default function DashboardPage() {
    return (
        <div className="space-y-4">
            <Card className="p-6">
                <h1 className="text-2xl font-semibold">Dashboard</h1>
                <p className="text-sm text-black/60 mt-2">
                    Resumen general. Próximo: métricas, tarjetas activas, últimos pagos.
                </p>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-5">
                    <div className="text-xs text-black/50">Tarjetas activas</div>
                    <div className="text-2xl font-semibold mt-1">—</div>
                </Card>

                <Card className="p-5">
                    <div className="text-xs text-black/50">Pagos (mes)</div>
                    <div className="text-2xl font-semibold mt-1">—</div>
                </Card>

                <Card className="p-5">
                    <div className="text-xs text-black/50">Compras (mes)</div>
                    <div className="text-2xl font-semibold mt-1">—</div>
                </Card>
            </div>
        </div>
    );
}
