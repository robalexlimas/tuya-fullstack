import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../auth/useAuth";
import RegisterForm from "../components/RegisterForm";

export default function RegisterContainer() {
    const { register } = useAuth();
    const nav = useNavigate();
    const [isSubmitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    return (
        <RegisterForm
            isSubmitting={isSubmitting}
            error={error}
            onSubmit={async (values) => {
                setError(null);
                setSubmitting(true);
                try {
                    await register(values);
                    nav("/dashboard", { replace: true });
                } catch (e: any) {
                    const msg =
                        e?.response?.data?.message ||
                        e?.response?.data?.title ||
                        "No se pudo registrar. Verifica datos.";
                    setError(msg);
                } finally {
                    setSubmitting(false);
                }
            }}
        />
    );
}