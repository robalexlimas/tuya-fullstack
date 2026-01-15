type Props = {
    onSubmit: (values: { username: string; password: string }) => void;
    isSubmitting: boolean;
    error?: string | null;
};

export default function LoginForm({ onSubmit, isSubmitting, error }: Props) {
    return (
        <div className="max-w-md w-full bg-white rounded-2xl shadow p-6">
            <h1 className="text-2xl font-semibold mb-1">Iniciar sesión</h1>
            <p className="text-sm text-gray-500 mb-6">Accede con tu usuario y contraseña</p>

            <form
                className="flex flex-col gap-3"
                onSubmit={(e) => {
                    e.preventDefault();
                    const form = e.currentTarget;
                    const fd = new FormData(form);
                    onSubmit({
                        username: String(fd.get("username") ?? ""),
                        password: String(fd.get("password") ?? ""),
                    });
                }}
            >
                <input
                    name="username"
                    placeholder="Usuario"
                    className="border rounded-xl px-3 py-2"
                    autoComplete="username"
                    required
                />
                <input
                    name="password"
                    type="password"
                    placeholder="Contraseña"
                    className="border rounded-xl px-3 py-2"
                    autoComplete="current-password"
                    required
                />

                {error ? <div className="text-sm text-red-600">{error}</div> : null}

                <button
                    disabled={isSubmitting}
                    className="mt-2 rounded-xl bg-black text-white py-2 disabled:opacity-50"
                >
                    {isSubmitting ? "Ingresando..." : "Ingresar"}
                </button>
            </form>
        </div>
    );
}
