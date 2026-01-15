import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@auth/useAuth";

export default function PrivateRoute() {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="min-h-screen grid place-items-center">
                <div className="text-sm text-black/60">Cargando sesión...</div>
            </div>
        );
    }

    if (!user) return <Navigate to="/login" replace />;

    return <Outlet />;
}
