"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";

type ButtonVariant = "solid" | "ghost" | "outline";
type ButtonSize = "sm" | "md" | "icon";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: ButtonVariant;
    size?: ButtonSize;
};

const sizeClasses: Record<ButtonSize, string> = {
    sm: "h-8 px-3 text-xs",
    md: "h-10 px-4 text-sm",
    icon: "h-10 w-10 p-0",
};

const variantClasses: Record<ButtonVariant, string> = {
    solid: "bg-indigo-600 text-white shadow-[0_8px_24px_-14px_rgba(30,144,255,0.9)] hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400",
    ghost: "border border-transparent text-[var(--color-foreground-muted)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-foreground)]",
    outline:
        "border border-[var(--color-border)] bg-[var(--color-surface-2)] text-[var(--color-foreground-muted)] hover:border-[var(--color-border-strong)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-foreground)]",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    function Button(
        { variant = "outline", size = "sm", className = "", ...props },
        ref,
    ) {
        return (
            <button
                ref={ref}
                className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg font-medium transition-all duration-250 ease-out hover:-translate-y-px hover:scale-[1.01] active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/45 disabled:pointer-events-none disabled:opacity-60 ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
                {...props}
            />
        );
    },
);
