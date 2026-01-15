import Button from "@components/ui/Button";
import { useAuth } from "@auth/useAuth";
import { useNavigate } from "react-router-dom";

export default function Topbar() {
    const { user, logout } = useAuth();
    const nav = useNavigate();

    return (
        <header className="sticky top-0 z-10 bg-tuya-white/80 backdrop-blur border-b border-black/5">
            <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                <div className="flex flex-col">
                    <span className="text-sm font-semibold text-tuya-black">
                        Hola, {user?.username ?? "Usuario"}
                    </span>
                    <span className="text-xs text-black/50">{user?.email}</span>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        onClick={() => nav("/dashboard")}
                        className="hidden sm:inline-flex"
                    >
                        Inicio
                    </Button>

                    <Button
                        variant="secondary"
                        onClick={() => {
                            logout();
                            nav("/login", { replace: true });
                        }}
                    >
                        Cerrar sesión
                    </Button>
                </div>
            </div>
        </header>
    );
}
