"use client";

import Icon from "@mdi/react";
import { mdiCheck, mdiChevronDown } from "@mdi/js";
import {
    useEffect,
    useId,
    useMemo,
    useRef,
    useState,
    type CSSProperties,
} from "react";
import { Button } from "@/components/atoms/Button";
import { InputSmall } from "@/components/atoms/InputSmall";

type DropdownOption = {
    value: string;
    label: string;
};

type DropdownProps = {
    value: string;
    options: DropdownOption[];
    onChange: (nextValue: string) => void;
    placeholder?: string;
    searchable?: boolean;
    searchPlaceholder?: string;
    emptyMessage?: string;
    className?: string;
    triggerClassName?: string;
    menuClassName?: string;
    optionClassName?: string;
    disabled?: boolean;
    ariaLabel?: string;
};

export function Dropdown({
    value,
    options,
    onChange,
    placeholder,
    searchable = false,
    searchPlaceholder = "Поиск...",
    emptyMessage = "Ничего не найдено",
    className = "",
    triggerClassName = "",
    menuClassName = "",
    optionClassName = "",
    disabled = false,
    ariaLabel,
}: DropdownProps) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [menuWidth, setMenuWidth] = useState<number>();
    const rootRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const menuId = useId();

    const selectedOption = useMemo(
        () => options.find((item) => item.value === value),
        [options, value],
    );

    const filteredOptions = useMemo(() => {
        if (!searchable) {
            return options;
        }
        const normalizedQuery = query.trim().toLocaleLowerCase();
        if (!normalizedQuery) {
            return options;
        }
        return options.filter((option) =>
            option.label.toLocaleLowerCase().includes(normalizedQuery),
        );
    }, [options, query, searchable]);

    useEffect(() => {
        if (!open) {
            return;
        }
        const onOutsidePointer = (event: PointerEvent) => {
            if (!rootRef.current?.contains(event.target as Node)) {
                setOpen(false);
            }
        };
        const onEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setOpen(false);
            }
        };

        window.addEventListener("pointerdown", onOutsidePointer);
        window.addEventListener("keydown", onEscape);
        return () => {
            window.removeEventListener("pointerdown", onOutsidePointer);
            window.removeEventListener("keydown", onEscape);
        };
    }, [open]);

    const toggleOpen = () => {
        if (disabled) {
            return;
        }
        setOpen((current) => {
            if (!current) {
                const width = triggerRef.current?.offsetWidth;
                if (width) {
                    setMenuWidth(width);
                }
                setQuery("");
            }
            return !current;
        });
    };

    const onSelect = (nextValue: string) => {
        onChange(nextValue);
        setQuery("");
        setOpen(false);
    };

    const menuStyle: CSSProperties | undefined = menuWidth
        ? { minWidth: `${menuWidth}px`, width: `${menuWidth}px` }
        : undefined;

    return (
        <div ref={rootRef} className={`relative min-w-0 ${className}`}>
            <Button
                ref={triggerRef}
                variant="outline"
                size="sm"
                aria-haspopup="listbox"
                aria-expanded={open}
                aria-controls={menuId}
                aria-label={ariaLabel}
                disabled={disabled}
                onClick={toggleOpen}
                className={`min-w-34 justify-between gap-3 ${triggerClassName}`}
            >
                <span className="min-w-0 truncate text-left">
                    {selectedOption?.label ?? placeholder ?? "Выберите"}
                </span>
                <Icon
                    path={mdiChevronDown}
                    size={0.72}
                    className={`shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                    aria-hidden
                />
            </Button>

            <div
                id={menuId}
                role="listbox"
                tabIndex={-1}
                style={menuStyle}
                className={`absolute left-0 top-full z-30 mt-2 origin-top rounded-lg border border-(--color-border) bg-(--color-background-elevated) p-1 shadow-(--color-panel-shadow) transition-all duration-180 ${open ? "pointer-events-auto translate-y-0 scale-100 opacity-100" : "pointer-events-none -translate-y-1 scale-98 opacity-0"} ${menuClassName}`}
            >
                <div className="rounded-lg space-y-2 overflow-x-hidden">
                    {searchable ? (
                        <InputSmall
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                            placeholder={searchPlaceholder}
                            className="h-8 w-full"
                        />
                    ) : null}

                    <div className="max-h-72 overflow-y-auto overflow-x-hidden rounded-lg space-y-2 pr-1">
                        {filteredOptions.length === 0 ? (
                            <p className="px-3 py-2 text-sm text-(--color-foreground-dim)">
                                {emptyMessage}
                            </p>
                        ) : null}

                        {filteredOptions.map((option, index) => {
                            const active = option.value === value;
                            return (
                                <Button
                                    key={`${option.value}-${index}`}
                                    variant="ghost"
                                    size="sm"
                                    role="option"
                                    aria-selected={active}
                                    onClick={() => onSelect(option.value)}
                                    className={`w-full min-w-0 justify-between rounded-lg px-3 text-left text-sm ${active ? "bg-indigo-500/18 text-indigo-400 hover:bg-indigo-500/22 hover:text-indigo-300" : ""} ${optionClassName}`}
                                >
                                    <span className="min-w-0 truncate">
                                        {option.label}
                                    </span>
                                    {active ? (
                                        <Icon
                                            path={mdiCheck}
                                            size={0.7}
                                            aria-hidden
                                        />
                                    ) : null}
                                </Button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
