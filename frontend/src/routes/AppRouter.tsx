import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import AppLayout from "@/layouts/AppLayout";

import LoginPage from "@pages/LoginPage";
import RegisterPage from "@pages/RegisterPage";
import DashboardPage from "@pages/DashboardPage";
import CardsPage from "@pages/CardsPage";
import PaymentsPage from "@pages/PaymentsPage";
import TransactionsPage from "@pages/TransactionsPage";

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Protected */}
                <Route element={<PrivateRoute />}>
                    <Route element={<AppLayout />}>
                        <Route path="/" element={<Navigate to="/dashboard" replace />} />

                        <Route path="/dashboard" element={<DashboardPage />} />
                        <Route path="/cards" element={<CardsPage />} />
                        <Route path="/payments" element={<PaymentsPage />} />
                        <Route path="/transactions" element={<TransactionsPage />} />

                        <Route path="*" element={<Navigate to="/dashboard" replace />} />
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    );
}