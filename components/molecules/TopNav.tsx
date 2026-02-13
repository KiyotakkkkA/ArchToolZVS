"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
    { href: "/", label: "Главная" },
    { href: "/architect/uml/c4", label: "C4 UML" },
];

type TopNavProps = {
    orientation?: "horizontal" | "vertical";
    onNavigate?: () => void;
};

export function TopNav({
    orientation = "horizontal",
    onNavigate,
}: TopNavProps) {
    const pathname = usePathname();
    const vertical = orientation === "vertical";

    return (
        <nav
            aria-label="Основная навигация"
            className={`flex ${
                vertical
                    ? "w-full flex-col items-stretch gap-2"
                    : "items-center gap-2"
            }`}
        >
            {navItems.map((item) => {
                const active = pathname === item.href;
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        onClick={onNavigate}
                        className={`rounded-r-lg text-sm font-medium transition-all duration-200 ease-out hover:-translate-y-px ${
                            vertical ? "px-4 py-2.5" : "px-3 py-2"
                        } ${
                            active
                                ? "border-l-2 border-indigo-500/35 bg-indigo-500/14 text-indigo-500"
                                : "text-(--color-foreground-muted) hover:bg-(--color-surface-hover) hover:text-(--color-foreground)"
                        } ${
                            vertical
                                ? "inline-flex w-full items-center justify-between"
                                : "inline-flex items-center"
                        }`}
                    >
                        <span>{item.label}</span>
                    </Link>
                );
            })}
        </nav>
    );
}
