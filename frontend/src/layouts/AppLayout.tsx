import { Outlet } from "react-router-dom";
import Sidebar from "@components/layout/Sidebar";
import Topbar from "@components/layout/Topbar";

export default function AppLayout() {
    return (
        <div className="min-h-screen bg-tuya-gray">
            <div className="flex">
                <Sidebar />

                <div className="flex-1 min-w-0">
                    <Topbar />

                    <main className="p-6">
                        <div className="max-w-6xl mx-auto">
                            <Outlet />
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
