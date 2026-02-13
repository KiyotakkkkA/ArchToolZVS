"use client";

import {
    useEffect,
    type PropsWithChildren,
    type ReactNode,
    type MouseEvent,
} from "react";
import { createPortal } from "react-dom";
import Icon from "@mdi/react";
import { mdiClose } from "@mdi/js";
import { Button } from "@/components/atoms/Button";

type ModalProps = PropsWithChildren<{
    open: boolean;
    title: ReactNode;
    onClose: () => void;
    footer?: ReactNode;
    className?: string;
}>;

export function Modal({
    open,
    title,
    onClose,
    footer,
    className = "",
    children,
}: ModalProps) {
    useEffect(() => {
        if (!open) {
            return;
        }

        const onEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        window.addEventListener("keydown", onEscape);
        return () => window.removeEventListener("keydown", onEscape);
    }, [open, onClose]);

    if (!open) {
        return null;
    }

    const onOverlayClick = (event: MouseEvent<HTMLDivElement>) => {
        if (event.target === event.currentTarget) {
            onClose();
        }
    };

    return createPortal(
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4 py-6 backdrop-blur-[3px] animate-in fade-in duration-200"
            onClick={onOverlayClick}
            aria-modal
            role="dialog"
        >
            <div
                className={`w-full max-w-5xl rounded-2xl border border-(--color-border) bg-(--color-background-elevated) shadow-(--color-panel-shadow) animate-in zoom-in-95 slide-in-from-bottom-2 duration-220 ${className}`}
            >
                <div className="flex items-center justify-between border-b border-(--color-border) px-4 py-3">
                    <h3 className="text-base font-semibold text-(--color-foreground)">
                        {title}
                    </h3>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={onClose}
                        aria-label="Закрыть окно"
                    >
                        <Icon path={mdiClose} size={0.74} aria-hidden />
                    </Button>
                </div>

                <div className="max-h-[70vh] overflow-y-auto overflow-x-hidden px-4 py-4">
                    {children}
                </div>

                {footer ? (
                    <div className="flex items-center justify-end gap-2 border-t border-(--color-border) px-4 py-3">
                        {footer}
                    </div>
                ) : null}
            </div>
        </div>,
        document.body,
    );
}
