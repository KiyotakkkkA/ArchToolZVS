import type { PropsWithChildren } from "react";
import { AppHeader } from "@/components/organisms/AppHeader";

export function AppShell({ children }: PropsWithChildren) {
    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_20%_10%,rgba(56,189,248,0.16),transparent_34%),radial-gradient(circle_at_80%_90%,rgba(52,211,153,0.13),transparent_40%),var(--color-background)] text-(--color-foreground) transition-colors dark:bg-[radial-gradient(circle_at_16%_12%,rgba(43,122,176,0.28),transparent_38%),radial-gradient(circle_at_80%_84%,rgba(36,72,124,0.18),transparent_42%),var(--color-background)]">
            <AppHeader />
            <main className="mx-auto w-full max-w-375 px-4 py-5 md:px-6 md:py-6">
                {children}
            </main>
        </div>
    );
}
