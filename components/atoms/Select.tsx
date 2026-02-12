"use client";

import { Dropdown } from "@/components/atoms/Dropdown";

type SelectOption = {
  value: string;
  label: string;
};

type SelectProps = {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
  className?: string;
  wrapperClassName?: string;
};

export function Select({
  value,
  onChange,
  options,
  placeholder,
  searchable = false,
  searchPlaceholder,
  emptyMessage,
  disabled,
  className = "",
  wrapperClassName = "",
}: SelectProps) {
  return (
    <div
      className={`flex w-full items-center gap-2 text-sm text-(--color-foreground-muted) ${wrapperClassName}`}
    >
      <Dropdown
        value={value}
        onChange={onChange}
        options={options}
        placeholder={placeholder}
        searchable={searchable}
        searchPlaceholder={searchPlaceholder}
        emptyMessage={emptyMessage}
        disabled={disabled}
        className="w-full"
        triggerClassName={`w-full ${className}`}
      />
    </div>
  );
}
