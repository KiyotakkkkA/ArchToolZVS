import type { PropsWithChildren } from "react";

type PanelProps = PropsWithChildren<{
    className?: string;
}>;

export function Panel({ children, className = "" }: PanelProps) {
    return (
        <section
            className={`rounded-2xl border border-(--color-border) bg-(--color-surface-1) p-4 shadow-(--color-panel-shadow) backdrop-blur-sm ${className}`}
        >
            {children}
        </section>
    );
}
