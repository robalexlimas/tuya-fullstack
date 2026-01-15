import { NavLink } from "react-router-dom";

const navItems = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/cards", label: "Tarjetas" },
    { to: "/payments", label: "Pagos" },
    { to: "/transactions", label: "Transacciones" },
];

export default function Sidebar() {
    return (
        <aside className="hidden md:flex md:flex-col w-64 bg-tuya-white border-r border-black/5 min-h-screen">
            <div className="p-6">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-tuya-red grid place-items-center text-white font-bold">
                        T
                    </div>
                    <div>
                        <div className="font-semibold leading-tight">Tuya</div>
                        <div className="text-xs text-black/50">Credit Card App</div>
                    </div>
                </div>
            </div>

            <nav className="px-3 pb-6 flex-1">
                <div className="text-xs font-medium text-black/40 px-3 mb-2">
                    MENÚ
                </div>

                <div className="flex flex-col gap-1">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={({ isActive }) =>
                                [
                                    "px-3 py-2 rounded-xl text-sm transition",
                                    isActive
                                        ? "bg-tuya-red text-white"
                                        : "text-tuya-black hover:bg-black/5",
                                ].join(" ")
                            }
                        >
                            {item.label}
                        </NavLink>
                    ))}
                </div>
            </nav>

            <div className="p-4 border-t border-black/5 text-xs text-black/50">
                © {new Date().getFullYear()} Tuya • Demo
            </div>
        </aside>
    );
}
