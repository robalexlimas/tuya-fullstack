import Card from "@components/ui/Card";

type Props = {
    label: string;
    value: string;
    hint?: string;
};

export default function StatCard({ label, value, hint }: Props) {
    return (
        <Card className="p-5">
            <div className="text-xs text-black/50">{label}</div>
            <div className="text-2xl font-semibold mt-1">{value}</div>
            {hint ? <div className="text-xs text-black/50 mt-2">{hint}</div> : null}
        </Card>
    );
}
