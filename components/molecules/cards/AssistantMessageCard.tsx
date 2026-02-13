import Icon from "@mdi/react";
import { mdiRobotExcitedOutline } from "@mdi/js";

type AssistantMessageCardProps = {
    model?: string;
    content: string;
    createdAt: number;
};

export function AssistantMessageCard({
    model,
    content,
    createdAt,
}: AssistantMessageCardProps) {
    return (
        <article className="max-w-[92%] rounded-2xl rounded-tl-md border border-(--color-border) bg-(--color-surface-2) px-3 py-2 text-sm text-(--color-foreground) shadow-[0_8px_24px_-20px_rgba(15,23,42,0.8)] transition-all duration-250 hover:border-(--color-border-strong)">
            <p className="mb-1 inline-flex items-center gap-1 text-[11px] font-medium text-(--color-foreground-dim)">
                <Icon path={mdiRobotExcitedOutline} size={0.58} aria-hidden />{" "}
                {model || "ИИ"}
            </p>
            <p className="whitespace-pre-wrap wrap-break-word leading-relaxed">
                {content}
            </p>
            <p className="mt-1 text-[11px] text-(--color-foreground-dim)">
                {new Date(createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                })}
            </p>
        </article>
    );
}
