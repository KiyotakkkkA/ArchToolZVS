import { TopNav } from "@/components/molecules/TopNav";
import { ThemeToggle } from "@/components/molecules/ThemeToggle";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-(--color-border) bg-[color-mix(in_oklab,var(--color-background-elevated)_84%,transparent)] backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-375 items-center justify-between gap-3 px-4 py-3 md:px-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-600/90">
            Arch Tools
          </p>
          <h1 className="text-sm font-semibold text-(--color-foreground) md:text-base flex gap-2">
            <span>Доверьте</span>
            <span className="text-sky-300/90">НАМ</span>
            <span>вашу архитектуру</span>
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <TopNav />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
