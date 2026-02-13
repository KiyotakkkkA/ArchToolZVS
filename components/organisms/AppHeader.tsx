"use client";

import { useState } from "react";
import Icon from "@mdi/react";
import { mdiMenu } from "@mdi/js";

import { Button } from "@/components/atoms/Button";
import { Panel } from "@/components/atoms/Panel";
import { SlidedPanel } from "@/components/atoms/SlidedPanel";
import { TopNav } from "@/components/molecules/TopNav";
import { ThemeToggle } from "@/components/molecules/ThemeToggle";

export function AppHeader() {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <>
            <header className="sticky top-0 z-40 border-b border-(--color-border) bg-[color-mix(in_oklab,var(--color-background-elevated)_72%,transparent)] backdrop-blur-xl">
                <div className="mx-auto flex w-full max-w-375 items-center justify-between gap-3 px-4 py-2 md:px-6 md:py-3">
                    <div className="flex min-w-0 items-center gap-3">
                        <div className="grid h-10 w-10 place-items-center rounded-xl border border-(--color-border) bg-(--color-surface-2) text-sm font-bold text-sky-500">
                            AT
                        </div>
                        <div className="min-w-0">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-600/90">
                                Arch Tools
                            </p>
                            <h1 className="truncate text-sm font-semibold text-(--color-foreground) md:text-base flex gap-2">
                                <span>Доверьте</span>
                                <span className="text-sky-300/90">НАМ</span>
                                <span>вашу архитектуру</span>
                            </h1>
                        </div>
                    </div>
                    <Button
                        onClick={() => setMenuOpen(true)}
                        aria-label="Открыть меню"
                        title="Меню"
                        size="md"
                        variant="outline"
                        className="px-3"
                    >
                        <Icon path={mdiMenu} size={0.9} aria-hidden />
                        <span className="hidden sm:inline">Меню</span>
                    </Button>
                </div>
            </header>

            <SlidedPanel
                open={menuOpen}
                onClose={() => setMenuOpen(false)}
                outsideClickClosing
                title={
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-500/85">
                            Меню
                        </p>
                        <p className="text-sm font-semibold text-(--color-foreground)">
                            Arch Tools
                        </p>
                    </div>
                }
            >
                <div className="space-y-4">
                    <Panel className="flex items-center justify-between gap-3">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-(--color-foreground-muted)">
                                Тема
                            </p>
                            <p className="text-sm text-(--color-foreground)">
                                Цветовая схема приложения
                            </p>
                        </div>
                        <ThemeToggle />
                    </Panel>
                    <Panel className="space-y-3">
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-(--color-foreground-muted)">
                            Навигация
                        </p>
                        <TopNav
                            orientation="vertical"
                            onNavigate={() => setMenuOpen(false)}
                        />
                    </Panel>
                </div>
            </SlidedPanel>
        </>
    );
}
