import { Link } from "react-router-dom";
import Button from "@components/ui/Button";
import Input from "@components/ui/Input";
import Card from "@components/ui/Card";

type Props = {
    onSubmit: (values: { username: string; email: string; password: string }) => void;
    isSubmitting: boolean;
    error?: string | null;
};

export default function RegisterForm({ onSubmit, isSubmitting, error }: Props) {
    return (
        <Card className="max-w-md p-6">
            <div className="mb-5">
                <h1 className="text-2xl font-semibold">Crear cuenta</h1>
                <p className="text-sm text-black/60 mt-1">
                    Regístrate para empezar
                </p>
            </div>

            <form
                className="flex flex-col gap-3"
                onSubmit={(e) => {
                    e.preventDefault();
                    const fd = new FormData(e.currentTarget);
                    onSubmit({
                        username: String(fd.get("username") ?? ""),
                        email: String(fd.get("email") ?? ""),
                        password: String(fd.get("password") ?? ""),
                    });
                }}
            >
                <div className="space-y-1">
                    <label className="text-xs font-medium text-black/70">Usuario</label>
                    <Input name="username" required />
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-medium text-black/70">Email</label>
                    <Input name="email" type="email" required />
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-medium text-black/70">Contraseña</label>
                    <Input name="password" type="password" required />
                </div>

                {error ? (
                    <div className="rounded-xl bg-tuya-red/10 text-tuya-red text-sm px-3 py-2">
                        {error}
                    </div>
                ) : null}

                <Button type="submit" disabled={isSubmitting} className="mt-2">
                    {isSubmitting ? "Creando..." : "Crear cuenta"}
                </Button>

                <p className="text-sm text-black/60 mt-2">
                    ¿Ya tienes cuenta?{" "}
                    <Link className="text-tuya-red font-medium" to="/login">
                        Inicia sesión
                    </Link>
                </p>
            </form>
        </Card>
    );
}