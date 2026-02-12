"use client";

import Icon from "@mdi/react";
import {
  mdiArrowBottomRight,
  mdiCreationOutline,
  mdiPlusCircle,
} from "@mdi/js";
import { Accordion } from "@/components/atoms/Accordion";
import { Button } from "@/components/atoms/Button";
import { InputBig } from "@/components/atoms/InputBig";
import { Select } from "@/components/atoms/Select";
import type { DiagramType } from "@/lib/c4/normalizeC4Source";

type Option = {
  value: string;
  label: string;
};

type ManualEditorViewProps = {
  diagramType: DiagramType;
  diagramTypes: Option[];
  source: string;
  onDiagramTypeChange: (value: DiagramType) => void;
  onSourceChange: (value: string) => void;
  onOpenAi: () => void;
  onOpenElementModal: () => void;
  onOpenRelationModal: () => void;
};

export function ManualEditorView({
  diagramType,
  diagramTypes,
  source,
  onDiagramTypeChange,
  onSourceChange,
  onOpenAi,
  onOpenElementModal,
  onOpenRelationModal,
}: ManualEditorViewProps) {
  return (
    <div className="space-y-3 animate-in fade-in slide-in-from-left-1 duration-200">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-[1.75rem] font-semibold text-(--color-foreground)">
          Редактор C4
        </h2>
        <div className="flex items-center gap-2 text-sm">
          <label className="text-(--color-foreground-dim)">Уровень:</label>
          <Select
            value={diagramType}
            onChange={(value) => onDiagramTypeChange(value as DiagramType)}
            options={diagramTypes}
          />
        </div>
      </div>

      <Accordion
        title="Код диаграммы"
        defaultOpen
        headerClassName="hover:bg-(--color-surface-hover)"
      >
        <InputBig
          value={source}
          onChange={(event) => onSourceChange(event.target.value)}
          spellCheck={false}
          className="h-[420px] w-full resize-y rounded-lg border border-(--color-border) bg-(--color-background-elevated) p-3 font-mono text-sm leading-relaxed text-(--color-foreground) outline-none duration-200 focus-visible:ring-2 focus-visible:ring-sky-500/40"
        />
      </Accordion>

      <div className="flex items-center gap-2 pt-1">
        <Button aria-label="Открыть AI ассистент" onClick={onOpenAi}>
          <Icon path={mdiCreationOutline} size={0.72} aria-hidden />
        </Button>
        <Button className="flex-1" onClick={onOpenElementModal}>
          <span className="text-sm">Добавить элемент</span>
          <Icon path={mdiPlusCircle} size={0.72} aria-hidden />
        </Button>
        <Button className="flex-1" onClick={onOpenRelationModal}>
          <span className="text-sm">Добавить связь</span>
          <Icon path={mdiArrowBottomRight} size={0.72} aria-hidden />
        </Button>
      </div>
    </div>
  );
}
