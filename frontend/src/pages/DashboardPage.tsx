import Button from "@components/ui/Button";
import Card from "@components/ui/Card";
import { useAuth } from "@auth/useAuth";

export default function DashboardPage() {
    const { user, logout } = useAuth();

    return (
        <div className="min-h-screen p-6">
            <div className="max-w-4xl mx-auto space-y-4">
                <Card className="p-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">Dashboard</h1>
                        <p className="text-sm text-black/60 mt-1">
                            Sesión activa como <span className="font-medium">{user?.username}</span>
                        </p>
                    </div>
                    <Button variant="secondary" onClick={logout}>
                        Cerrar sesión
                    </Button>
                </Card>

                <Card className="p-6">
                    <h2 className="text-lg font-semibold">Siguiente paso</h2>
                    <p className="text-sm text-black/60 mt-2">
                        Aquí montaremos: Cards, Payments, Transactions (con layout tipo fintech).
                    </p>
                </Card>
            </div>
        </div>
    );
}
