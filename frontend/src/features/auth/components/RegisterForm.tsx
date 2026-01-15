type Props = {
    onSubmit: (values: { username: string; email: string; password: string }) => void;
    isSubmitting: boolean;
    error?: string | null;
};

export default function RegisterForm({ onSubmit, isSubmitting, error }: Props) {
    return (
        <div className="max-w-md w-full bg-white rounded-2xl shadow p-6">
            <h1 className="text-2xl font-semibold mb-1">Crear cuenta</h1>
            <p className="text-sm text-gray-500 mb-6">Regístrate para empezar</p>

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
                <input name="username" placeholder="Usuario" className="border rounded-xl px-3 py-2" required />
                <input name="email" placeholder="Email" className="border rounded-xl px-3 py-2" required />
                <input name="password" type="password" placeholder="Contraseña" className="border rounded-xl px-3 py-2" required />

                {error ? <div className="text-sm text-red-600">{error}</div> : null}

                <button disabled={isSubmitting} className="mt-2 rounded-xl bg-black text-white py-2 disabled:opacity-50">
                    {isSubmitting ? "Creando..." : "Crear cuenta"}
                </button>
            </form>
        </div>
    );
}
