type Props = {
    open: boolean;
    title: string;
    children: React.ReactNode;
    onClose: () => void;
};

export default function Modal({ open, title, children, onClose }: Props) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50">
            <div
                className="absolute inset-0 bg-black/40"
                onClick={onClose}
                aria-hidden
            />

            <div className="absolute inset-0 flex items-center justify-center p-4">
                <div className="w-full max-w-lg rounded-2xl bg-tuya-white shadow-xl border border-black/10">
                    <div className="px-6 py-4 border-b border-black/5 flex items-center justify-between">
                        <div className="font-semibold">{title}</div>
                        <button
                            onClick={onClose}
                            className="rounded-lg px-2 py-1 text-black/60 hover:bg-black/5"
                        >
                            ✕
                        </button>
                    </div>

                    <div className="p-6">{children}</div>
                </div>
            </div>
        </div>
    );
}
