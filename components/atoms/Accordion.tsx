"use client";

import Icon from "@mdi/react";
import { mdiChevronDown } from "@mdi/js";
import { useId, useState, type ReactNode } from "react";
import { Button } from "@/components/atoms/Button";

type AccordionProps = {
  title: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
};

export function Accordion({
  title,
  children,
  defaultOpen = false,
  className = "",
  headerClassName = "",
  contentClassName = "",
}: AccordionProps) {
  const [open, setOpen] = useState(defaultOpen);
  const contentId = useId();

  return (
    <div className={`rounded-xl border border-(--color-border) ${className}`}>
      <Button
        variant="ghost"
        size="md"
        aria-expanded={open}
        aria-controls={contentId}
        onClick={() => setOpen((value) => !value)}
        className={`h-auto w-full justify-between rounded-b-none rounded-t-xl px-3 py-2 text-sm font-medium text-(--color-foreground) hover:translate-y-0 hover:scale-100 ${headerClassName}`}
      >
        <span className="inline-flex items-center gap-2">{title}</span>
        <Icon
          path={mdiChevronDown}
          size={0.84}
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          aria-hidden
        />
      </Button>

      <div
        id={contentId}
        className={`grid transition-all duration-250 ease-out ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
      >
        <div className="overflow-hidden">
          <div
            className={`border-t border-(--color-border) p-3 transition-all duration-250 ${contentClassName}`}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
