import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../auth/useAuth";
import LoginForm from "../components/LoginForm";

export default function LoginContainer() {
    const { login } = useAuth();
    const nav = useNavigate();
    const [isSubmitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    return (
        <LoginForm
            isSubmitting={isSubmitting}
            error={error}
            onSubmit={async (values) => {
                setError(null);
                setSubmitting(true);
                try {
                    await login(values);
                    nav("/dashboard");
                } catch (e: any) {
                    const msg =
                        e?.response?.data?.message ||
                        e?.response?.data?.title ||
                        "Credenciales inválidas o error de servidor.";
                    setError(msg);
                } finally {
                    setSubmitting(false);
                }
            }}
        />
    );
}
