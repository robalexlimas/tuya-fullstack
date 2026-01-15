type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "secondary" | "ghost";
};

export default function Button({
    variant = "primary",
    className = "",
    ...props
}: Props) {
    const base =
        "rounded-lg px-4 py-2 text-sm font-medium transition focus:outline-none";

    const variants = {
        primary:
            "bg-tuya-red text-white hover:bg-red-600",
        secondary:
            "bg-tuya-black text-white hover:bg-black/80",
        ghost:
            "bg-transparent text-tuya-black hover:bg-tuya-gray",
    };

    return (
        <button
            {...props}
            className={`${base} ${variants[variant]} ${className}`}
        />
    );
}
