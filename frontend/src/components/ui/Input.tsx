type Props = React.InputHTMLAttributes<HTMLInputElement>;

export default function Input({ className = "", ...props }: Props) {
    return (
        <input
            {...props}
            className={`w-full rounded-lg border border-gray-300 px-3 py-2 text-sm
        focus:border-tuya-red focus:ring-1 focus:ring-tuya-red
        ${className}`}
        />
    );
}
