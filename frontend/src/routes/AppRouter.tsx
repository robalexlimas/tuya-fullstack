import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import PrivateRoute from "./PrivateRoute";

function DashboardPlaceholder() {
    return (
        <div className="min-h-screen grid place-items-center bg-gray-50">
            <div className="bg-white rounded-2xl shadow p-6 max-w-md w-full">
                <h1 className="text-xl font-semibold">Dashboard</h1>
                <p className="text-sm text-gray-600 mt-2">
                    Estás logueado ✅. Próximo: cards, pagos, transacciones.
                </p>
            </div>
        </div>
    );
}

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Default */}
                <Route path="/" element={<Navigate to="/login" replace />} />

                {/* Public */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Protected */}
                <Route element={<PrivateRoute />}>
                    <Route path="/dashboard" element={<DashboardPlaceholder />} />
                </Route>

                {/* Not found */}
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </BrowserRouter>
    );
}
