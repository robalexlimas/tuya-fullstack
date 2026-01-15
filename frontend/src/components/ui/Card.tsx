import React from "react";

export default function Card({
    className = "",
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            {...props}
            className={
                "w-full rounded-2xl bg-tuya-white shadow-sm border border-black/5 " +
                className
            }
        />
    );
}
