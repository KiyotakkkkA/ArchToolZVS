"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Главная" },
  { href: "/architect/uml/c4", label: "C4 UML" },
];

export function TopNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Основная навигация" className="flex items-center gap-2">
      {navItems.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200 ease-out hover:-translate-y-px ${
              active
                ? "border border-sky-500/35 bg-sky-500/14 text-sky-500"
                : "border border-transparent text-(--color-foreground-muted) hover:border-(--color-border) hover:bg-(--color-surface-hover) hover:text-(--color-foreground)"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
