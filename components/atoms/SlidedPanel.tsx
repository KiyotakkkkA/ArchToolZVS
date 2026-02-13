"use client";

import { createPortal } from "react-dom";
import { Icon } from "@mdi/react";

import type React from "react";
import { mdiClose } from "@mdi/js";
import { Button } from "./Button";

interface SlidedPanelProps {
    open: boolean;
    onClose: () => void;
    title?: string | React.ReactNode;
    children: React.ReactNode;
    outsideClickClosing?: boolean;
}

const SlidedPanel = ({
    open,
    onClose,
    title,
    children,
    outsideClickClosing = false,
}: SlidedPanelProps) => {
    if (typeof document === "undefined") {
        return null;
    }

    return createPortal(
        <div
            className={`fixed inset-0 z-50 ${open ? "pointer-events-auto" : "pointer-events-none"}`}
            aria-hidden={!open}
        >
            <div
                className={`absolute inset-0 bg-black/46 backdrop-blur-[1px] transition-opacity duration-300 ${
                    open ? "opacity-100" : "opacity-0"
                }`}
                onClick={outsideClickClosing ? onClose : undefined}
            />
            <aside
                className={`absolute right-0 top-0 h-dvh w-[min(26rem,100vw)] border-l border-(--color-border) bg-(--color-background) shadow-(--color-panel-shadow) transition-transform duration-300 ease-out flex flex-col ${
                    open ? "translate-x-0" : "translate-x-full"
                }`}
            >
                <div className="flex items-center justify-between border-b border-(--color-border) bg-(--color-surface-1) px-4 py-3">
                    <div>{title}</div>
                    <Button
                        onClick={onClose}
                        size="icon"
                        variant="ghost"
                        className="rounded-lg"
                        aria-label="Закрыть меню"
                    >
                        <Icon path={mdiClose} className="h-7 w-7" />
                    </Button>
                </div>
                <div className="px-4 py-4 md:px-5 flex-1 min-h-0 overflow-y-auto">
                    {children}
                </div>
            </aside>
        </div>,
        document.body,
    );
};

export { SlidedPanel };
