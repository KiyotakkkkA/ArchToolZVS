type UserMessageCardProps = {
  content: string;
  createdAt: number;
};

export function UserMessageCard({ content, createdAt }: UserMessageCardProps) {
  return (
    <article className="ml-auto max-w-[92%] rounded-2xl rounded-tr-md border border-sky-500/30 bg-linear-to-br from-sky-500/20 to-cyan-500/10 px-3 py-2 text-sm text-(--color-foreground) shadow-[0_6px_20px_-16px_rgba(56,189,248,0.9)] transition-all duration-250 hover:border-sky-400/40 hover:shadow-[0_10px_26px_-16px_rgba(56,189,248,0.9)]">
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
