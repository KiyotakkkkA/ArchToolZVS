"use client";

import { forwardRef, type InputHTMLAttributes } from "react";

type InputSmallProps = InputHTMLAttributes<HTMLInputElement>;

export const InputSmall = forwardRef<HTMLInputElement, InputSmallProps>(
  function InputSmall({ className = "", ...props }, ref) {
    return (
      <input
        ref={ref}
        className={`h-9 w-full rounded-lg border border-(--color-border) bg-(--color-background-elevated) px-3 text-sm text-(--color-foreground) outline-none transition-all duration-200 placeholder:text-(--color-foreground-dim) focus-visible:border-sky-500/70 focus-visible:ring-2 focus-visible:ring-sky-500/25 ${className}`}
        {...props}
      />
    );
  },
);
