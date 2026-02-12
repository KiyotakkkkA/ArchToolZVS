"use client";

import { useEffect, useState } from "react";
import Icon from "@mdi/react";
import { mdiMoonWaningCrescent, mdiWhiteBalanceSunny } from "@mdi/js";
import { Button } from "@/components/atoms/Button";

type Theme = "light" | "dark";

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") {
      return "light";
    }
    const saved = localStorage.getItem("arch-theme");
    if (saved === "dark" || saved === "light") {
      return saved;
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const onToggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("arch-theme", next);
    applyTheme(next);
  };

  return (
    <Button
      onClick={onToggle}
      aria-label="Переключить тему"
      title="Сменить тему"
      size="icon"
      variant="outline"
      className={
        theme === "dark"
          ? "border-sky-500/60 bg-sky-500/15 text-sky-300 hover:border-sky-500/70 hover:bg-sky-500/22"
          : ""
      }
    >
      <Icon
        path={theme === "dark" ? mdiMoonWaningCrescent : mdiWhiteBalanceSunny}
        size={0.85}
        aria-hidden
      />
    </Button>
  );
}
