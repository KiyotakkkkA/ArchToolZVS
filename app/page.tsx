import Link from "next/link";

export default function Home() {
    return (
        <div className="mx-auto mt-8 max-w-3xl rounded-2xl border border-(--color-border) bg-(--color-surface-1) p-6 shadow-(--color-panel-shadow)">
            <h2 className="text-2xl font-semibold tracking-tight text-(--color-foreground)">
                Редактор C4
            </h2>
            <p className="mt-2 text-sm text-(--color-foreground-muted)">
                Контекст, контейнеры, компоненты и код — все в одном редакторе.
            </p>
            <Link
                href="/architect/uml/c4"
                className="mt-5 inline-flex h-10 items-center rounded-xl border border-transparent bg-sky-600 px-4 text-sm font-medium text-white transition-all duration-200 ease-out hover:-translate-y-px hover:bg-sky-500 active:scale-[0.98]"
            >
                Перейти в C4 UML
            </Link>
        </div>
    );
}
