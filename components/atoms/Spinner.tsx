"use client";

type SpinnerProps = {
  size?: "sm" | "md" | "lg";
  className?: string;
  label?: string;
};

const sizeMap: Record<NonNullable<SpinnerProps["size"]>, string> = {
  sm: "h-4 w-4 border-2",
  md: "h-7 w-7 border-2",
  lg: "h-11 w-11 border-3",
};

export function Spinner({
  size = "md",
  className = "",
  label = "Загрузка",
}: SpinnerProps) {
  return (
    <span
      className={`inline-flex items-center gap-2 ${className}`}
      role="status"
    >
      <span
        className={`${sizeMap[size]} animate-spin rounded-full border-(--color-border-strong) border-t-sky-400`}
        aria-hidden
      />
      <span className="text-xs text-(--color-foreground-dim)">{label}</span>
    </span>
  );
}
