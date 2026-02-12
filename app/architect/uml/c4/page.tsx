import { C4EditorPreview } from "@/components/organisms/C4EditorPreview";

export default function C4UmlPage() {
  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-(--color-border) bg-(--color-surface-1) p-4 shadow-(--color-panel-shadow) md:p-5">
        <h2 className="text-xl font-semibold tracking-tight text-(--color-foreground)">
          C4 Diagram Builder
        </h2>
        <p className="mt-1 text-sm text-(--color-foreground-muted)">
          Ну вообще чума!
        </p>
      </section>
      <C4EditorPreview />
    </div>
  );
}
