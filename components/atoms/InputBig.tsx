"use client";

import { forwardRef, type TextareaHTMLAttributes } from "react";

type InputBigProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export const InputBig = forwardRef<HTMLTextAreaElement, InputBigProps>(
    function InputBig({ className = "", ...props }, ref) {
        return (
            <textarea
                ref={ref}
                className={`min-h-24 w-full resize-y rounded-lg border border-(--color-border) bg-(--color-background-elevated) px-3 py-2.5 text-sm leading-relaxed text-(--color-foreground) outline-none transition-all duration-200 placeholder:text-(--color-foreground-dim) focus-visible:border-sky-500/70 focus-visible:ring-2 focus-visible:ring-sky-500/25 ${className}`}
                {...props}
            />
        );
    },
);
