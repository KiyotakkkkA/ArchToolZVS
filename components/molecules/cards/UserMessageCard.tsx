type UserMessageCardProps = {
    content: string;
    createdAt: number;
};

export function UserMessageCard({ content, createdAt }: UserMessageCardProps) {
    return (
        <article className="ml-auto max-w-[92%] rounded-lg rounded-tr-md border border-indigo-500/30 bg-linear-to-br from-indigo-500/20 to-indigo-400/10 px-3 py-2 text-sm text-(--color-foreground) transition-all duration-250 hover:border-indigo-400/40">
            <p className="whitespace-pre-wrap wrap-break-word leading-relaxed">
                {content}
            </p>
            <p className="mt-1 text-right text-[11px] text-(--color-foreground-dim)">
                {new Date(createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                })}
            </p>
        </article>
    );
}
