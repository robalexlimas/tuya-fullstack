import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "@pages/LoginPage";
import RegisterPage from "@pages/RegisterPage";
import DashboardPage from "@pages/DashboardPage";
import PrivateRoute from "./PrivateRoute";

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />

                {/* Public */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Protected */}
                <Route element={<PrivateRoute />}>
                    <Route path="/dashboard" element={<DashboardPage />} />
                </Route>

                <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
        </BrowserRouter>
    );
}