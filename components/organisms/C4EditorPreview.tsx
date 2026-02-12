"use client";

import Image from "next/image";
import Icon from "@mdi/react";
import { mdiRefresh, mdiCheck } from "@mdi/js";
import {
  useDeferredValue,
  useMemo,
  useRef,
  useState,
  useEffect,
  type PointerEventHandler,
  type WheelEventHandler,
} from "react";
import { Button } from "@/components/atoms/Button";
import { Panel } from "@/components/atoms/Panel";
import { Select } from "@/components/atoms/Select";
import { Modal } from "@/components/atoms/Modal";
import { InputSmall } from "@/components/atoms/InputSmall";
import { InputBig } from "@/components/atoms/InputBig";
import { Spinner } from "@/components/atoms/Spinner";
import { ManualEditorView } from "@/components/organisms/editor/ManualEditorView";
import { AiEditorView } from "@/components/organisms/editor/AiEditorView";
import type { AiChatMessage, FillC4DiagramResponse } from "@/app/types/AI";
import { defaultC4Snippet } from "@/lib/c4/defaultSnippet";
import {
  type DiagramType,
  normalizeC4Source,
} from "@/lib/c4/normalizeC4Source";
import { encodePlantUml } from "@/lib/plantuml/encodePlantUml";
import {
  addElementToC4Source,
  addRelationToC4Source,
  c4EntityTypeOptionsByDiagram,
  c4RelationshipTypeOptions,
  parseC4SourceStructure,
} from "@/lib/c4/sourceStructure";

const diagramTypes: { value: DiagramType; label: string }[] = [
  { value: "context", label: "Контекста" },
  { value: "container", label: "Контейнеров" },
  { value: "component", label: "Компонентов" },
  { value: "deployment", label: "Развертывания" },
];

export function C4EditorPreview() {
  const [chatInput, setChatInput] = useState("");
  const [chatIsLoading, setChatIsLoading] = useState(false);
  const [chatError, setChatError] = useState("");
  const [chatMessages, setChatMessages] = useState<AiChatMessage[]>([
    {
      id: "assistant-welcome",
      role: "assistant",
      content:
        "Привет! Я помогу собрать C4-диаграмму. Опишите, какие сущности и связи нужно добавить.",
      createdAt: Date.now(),
    },
  ]);

  const [leftPaneMode, setLeftPaneMode] = useState<"editor" | "chat">("editor");
  const [diagramType, setDiagramType] = useState<DiagramType>("container");
  const [source, setSource] = useState(defaultC4Snippet);
  const deferredSource = useDeferredValue(source);
  const [renderSource, setRenderSource] = useState(source);

  const [elementModalOpen, setElementModalOpen] = useState(false);
  const [relationModalOpen, setRelationModalOpen] = useState(false);
  const [formError, setFormError] = useState("");

  const [newElementType, setNewElementType] = useState(
    c4EntityTypeOptionsByDiagram.container[0].value,
  );
  const [newElementParent, setNewElementParent] = useState("__root__");
  const [newElementAlias, setNewElementAlias] = useState("");
  const [newElementLabel, setNewElementLabel] = useState("");
  const [newElementTechnology, setNewElementTechnology] = useState("");
  const [newElementDescription, setNewElementDescription] = useState("");

  const [newRelationType, setNewRelationType] = useState<string>(
    c4RelationshipTypeOptions[0].value,
  );
  const [newRelationFrom, setNewRelationFrom] = useState("");
  const [newRelationTo, setNewRelationTo] = useState("");
  const [newRelationLabel, setNewRelationLabel] = useState("");
  const [newRelationTechnology, setNewRelationTechnology] = useState("");
  const [newRelationDescription, setNewRelationDescription] = useState("");

  const [scale, setScale] = useState(1);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const dragState = useRef<{ startX: number; startY: number; active: boolean }>(
    {
      startX: 0,
      startY: 0,
      active: false,
    },
  );

  const [loadedUrl, setLoadedUrl] = useState("");

  useEffect(() => {
    const timeoutId = window.setTimeout(
      () => setRenderSource(deferredSource),
      220,
    );
    return () => window.clearTimeout(timeoutId);
  }, [deferredSource]);

  const normalizedSource = useMemo(
    () => normalizeC4Source(renderSource, diagramType),
    [renderSource, diagramType],
  );

  const parsedStructure = useMemo(
    () => parseC4SourceStructure(source),
    [source],
  );

  const elementTypeOptions = useMemo(
    () => c4EntityTypeOptionsByDiagram[diagramType],
    [diagramType],
  );

  const parentOptions = useMemo(
    () => [
      { value: "__root__", label: "Корень диаграммы" },
      ...parsedStructure.boundaries.map((boundary) => ({
        value: boundary.alias,
        label: `${boundary.type} · ${boundary.label} (${boundary.alias})`,
      })),
    ],
    [parsedStructure.boundaries],
  );

  const nodeOptions = useMemo(() => {
    const uniqueByAlias = new Map(
      parsedStructure.nodes.map((node) => [node.alias, node] as const),
    );

    return Array.from(uniqueByAlias.values()).map((node) => ({
      value: node.alias,
      label: `${node.label} (${node.alias})`,
    }));
  }, [parsedStructure.nodes]);

  const diagramUrl = useMemo(() => {
    if (!normalizedSource) {
      return "";
    }
    const encoded = encodePlantUml(normalizedSource);
    return `https://www.plantuml.com/plantuml/svg/${encoded}`;
  }, [normalizedSource]);

  const isLoading = Boolean(diagramUrl) && loadedUrl !== diagramUrl;

  const onWheel: WheelEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault();
    const next = event.deltaY < 0 ? scale * 1.08 : scale / 1.08;
    setScale(Math.min(2.6, Math.max(0.35, next)));
  };

  const onPointerDown: PointerEventHandler<HTMLDivElement> = (event) => {
    dragState.current = {
      active: true,
      startX: event.clientX,
      startY: event.clientY,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove: PointerEventHandler<HTMLDivElement> = (event) => {
    if (!dragState.current.active) {
      return;
    }
    const deltaX = event.clientX - dragState.current.startX;
    const deltaY = event.clientY - dragState.current.startY;
    dragState.current.startX = event.clientX;
    dragState.current.startY = event.clientY;
    setOffsetX((value) => value + deltaX);
    setOffsetY((value) => value + deltaY);
  };

  const onPointerUp: PointerEventHandler<HTMLDivElement> = (event) => {
    dragState.current.active = false;
    event.currentTarget.releasePointerCapture(event.pointerId);
  };

  const resetView = () => {
    setScale(1);
    setOffsetX(0);
    setOffsetY(0);
  };

  const isBoundaryType =
    newElementType === "Boundary" ||
    newElementType === "Enterprise_Boundary" ||
    newElementType === "System_Boundary" ||
    newElementType === "Container_Boundary" ||
    newElementType === "Deployment_Node" ||
    newElementType === "Node" ||
    newElementType === "Node_L" ||
    newElementType === "Node_R";

  const openElementModal = () => {
    setFormError("");
    setNewElementType(c4EntityTypeOptionsByDiagram[diagramType][0].value);
    setNewElementParent("__root__");
    setNewElementAlias("");
    setNewElementLabel("");
    setNewElementTechnology("");
    setNewElementDescription("");
    setElementModalOpen(true);
  };

  const openRelationModal = () => {
    setFormError("");
    setNewRelationType(c4RelationshipTypeOptions[0].value);
    setNewRelationFrom(nodeOptions[0]?.value ?? "");
    setNewRelationTo(nodeOptions[1]?.value ?? nodeOptions[0]?.value ?? "");
    setNewRelationLabel("");
    setNewRelationTechnology("");
    setNewRelationDescription("");
    setRelationModalOpen(true);
  };

  const saveElement = () => {
    const alias = newElementAlias.trim();
    const label = newElementLabel.trim();

    if (!alias || !label) {
      setFormError("Заполните alias и label для элемента.");
      return;
    }

    if (parsedStructure.aliases.has(alias)) {
      setFormError("Такой alias уже существует. Укажите уникальный alias.");
      return;
    }

    const nextSource = addElementToC4Source(source, {
      type: newElementType,
      alias,
      label,
      technology: newElementTechnology,
      description: newElementDescription,
      parentAlias: newElementParent,
    });

    setSource(nextSource);
    setFormError("");
    setElementModalOpen(false);
  };

  const saveRelation = () => {
    if (!newRelationFrom || !newRelationTo || !newRelationLabel.trim()) {
      setFormError("Выберите элементы и заполните название связи.");
      return;
    }

    const nextSource = addRelationToC4Source(source, {
      type: newRelationType,
      fromAlias: newRelationFrom,
      toAlias: newRelationTo,
      label: newRelationLabel,
      technology: newRelationTechnology,
      description: newRelationDescription,
    });

    setSource(nextSource);
    setFormError("");
    setRelationModalOpen(false);
  };

  const sendAiRequest = async () => {
    const prompt = chatInput.trim();
    if (!prompt || chatIsLoading) {
      return;
    }

    const userMessage: AiChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: prompt,
      createdAt: Date.now(),
    };

    setChatMessages((prev) => [...prev, userMessage]);
    setChatInput("");
    setChatError("");
    setChatIsLoading(true);

    try {
      const response = await fetch("/api/ai/c4", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userPrompt: prompt,
          currentSource: source,
          diagramType,
        }),
      });

      if (!response.ok) {
        const failed = (await response.json().catch(() => ({}))) as {
          message?: string;
        };
        throw new Error(
          failed.message || `AI запрос завершился ошибкой (${response.status})`,
        );
      }

      const data = (await response.json()) as FillC4DiagramResponse;
      setSource(data.nextSource);

      const assistantMessage: AiChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        model: data.model,
        content: `${data.summary}`,
        createdAt: Date.now(),
      };
      setChatMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Не удалось обновить диаграмму.";
      setChatError(message);
      setChatMessages((prev) => [
        ...prev,
        {
          id: `assistant-error-${Date.now()}`,
          role: "assistant",
          content: `Ошибка: ${message}`,
          createdAt: Date.now(),
        },
      ]);
    } finally {
      setChatIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-[460px_1fr]">
      <Panel className="h-fit p-4">
        {leftPaneMode === "editor" ? (
          <ManualEditorView
            diagramType={diagramType}
            diagramTypes={diagramTypes}
            source={source}
            onDiagramTypeChange={setDiagramType}
            onSourceChange={setSource}
            onOpenAi={() => setLeftPaneMode("chat")}
            onOpenElementModal={openElementModal}
            onOpenRelationModal={openRelationModal}
          />
        ) : (
          <AiEditorView
            messages={chatMessages}
            inputValue={chatInput}
            isLoading={chatIsLoading}
            errorText={chatError}
            onInputChange={setChatInput}
            onSend={sendAiRequest}
            onBackToEditor={() => setLeftPaneMode("editor")}
          />
        )}
      </Panel>

      <Panel className="relative min-h-[76vh] overflow-hidden p-0">
        <div className="flex items-center justify-between border-b border-(--color-border) px-4 py-3">
          <div>
            <h3 className="text-base font-semibold text-(--color-foreground)">
              Превью диаграммы
            </h3>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="rounded-lg border border-(--color-border) bg-(--color-surface-2) px-2 py-1">
              {Math.round(scale * 100)}%
            </span>
            <Button
              onClick={resetView}
              className="px-2"
              size="sm"
              variant="outline"
            >
              <Icon path={mdiRefresh} size={0.7} aria-hidden />
              Сброс
            </Button>
          </div>
        </div>

        <div
          className="relative h-[calc(76vh-54px)] overflow-hidden bg-[color-mix(in_oklab,var(--color-background-elevated)_82%,#0c1220_18%)]"
          onWheel={onWheel}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          {isLoading && (
            <div className="absolute inset-0 z-10 grid place-items-center bg-black/20 backdrop-blur-[1px]">
              <Spinner size="md" label="Перестраиваю диаграмму" />
            </div>
          )}

          {diagramUrl ? (
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{
                transform: `translate3d(${offsetX}px, ${offsetY}px, 0) scale(${scale})`,
                transformOrigin: "center center",
                willChange: "transform",
              }}
            >
              <Image
                src={diagramUrl}
                alt="C4 diagram preview"
                width={2000}
                height={1200}
                unoptimized
                onLoad={() => setLoadedUrl(diagramUrl)}
                onError={() => setLoadedUrl(diagramUrl)}
                className="rounded-md border border-(--color-border) bg-white shadow-lg pointer-events-none"
              />
            </div>
          ) : (
            <p className="p-6 text-sm text-(--color-foreground-dim)">
              Введите код PlantUML/C4, чтобы увидеть превью.
            </p>
          )}
        </div>
      </Panel>

      <Modal
        open={elementModalOpen}
        onClose={() => setElementModalOpen(false)}
        title="Новый элемент"
        footer={
          <>
            <Button
              variant="ghost"
              onClick={() => setElementModalOpen(false)}
              className="hover:scale-100"
            >
              Отмена
            </Button>
            <Button variant="solid" onClick={saveElement}>
              <Icon path={mdiCheck} size={0.72} aria-hidden />
              Сохранить
            </Button>
          </>
        }
      >
        <div className="space-y-3 md:space-y-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <label className="space-y-1 text-xs text-(--color-foreground-dim)">
              Тип элемента
              <Select
                value={newElementType}
                onChange={setNewElementType}
                options={elementTypeOptions}
                searchable
                searchPlaceholder="Фильтр по типам..."
              />
            </label>
            <label className="space-y-1 text-xs text-(--color-foreground-dim)">
              Родитель
              <Select
                value={newElementParent}
                onChange={setNewElementParent}
                options={parentOptions}
                searchable
                searchPlaceholder="Фильтр по родителю..."
              />
            </label>
          </div>

          <label className="space-y-1 text-xs text-(--color-foreground-dim)">
            Alias
            <InputSmall
              value={newElementAlias}
              onChange={(event) => setNewElementAlias(event.target.value)}
              placeholder="например: api_gateway"
            />
          </label>

          <label className="space-y-1 text-xs text-(--color-foreground-dim)">
            Label
            <InputSmall
              value={newElementLabel}
              onChange={(event) => setNewElementLabel(event.target.value)}
              placeholder="Название блока"
            />
          </label>

          {!isBoundaryType ? (
            <label className="space-y-1 text-xs text-(--color-foreground-dim)">
              Technology / Type
              <InputSmall
                value={newElementTechnology}
                onChange={(event) =>
                  setNewElementTechnology(event.target.value)
                }
                placeholder="Java, PostgreSQL, HTTPS..."
              />
            </label>
          ) : null}

          <label className="space-y-1 text-xs text-(--color-foreground-dim)">
            Description
            <InputBig
              value={newElementDescription}
              onChange={(event) => setNewElementDescription(event.target.value)}
              placeholder="Короткое описание назначения"
            />
          </label>

          {formError ? (
            <p className="text-xs text-rose-400">{formError}</p>
          ) : null}
        </div>
      </Modal>

      <Modal
        open={relationModalOpen}
        onClose={() => setRelationModalOpen(false)}
        title="Новая связь"
        footer={
          <>
            <Button
              variant="ghost"
              onClick={() => setRelationModalOpen(false)}
              className="hover:scale-100"
            >
              Отмена
            </Button>
            <Button variant="solid" onClick={saveRelation}>
              <Icon path={mdiCheck} size={0.72} aria-hidden />
              Сохранить
            </Button>
          </>
        }
      >
        <div className="space-y-3 md:space-y-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <label className="space-y-1 text-xs text-(--color-foreground-dim)">
              Тип связи
              <Select
                value={newRelationType}
                onChange={setNewRelationType}
                options={c4RelationshipTypeOptions.map((item) => ({
                  value: item.value,
                  label: item.label,
                }))}
                searchable
                searchPlaceholder="Фильтр по типу связи..."
              />
            </label>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <label className="space-y-1 text-xs text-(--color-foreground-dim)">
              Откуда
              <Select
                value={newRelationFrom}
                onChange={setNewRelationFrom}
                options={nodeOptions}
                searchable
                searchPlaceholder="Фильтр источника..."
              />
            </label>
            <label className="space-y-1 text-xs text-(--color-foreground-dim)">
              Куда
              <Select
                value={newRelationTo}
                onChange={setNewRelationTo}
                options={nodeOptions}
                searchable
                searchPlaceholder="Фильтр назначения..."
              />
            </label>
          </div>

          <label className="space-y-1 text-xs text-(--color-foreground-dim)">
            Название связи
            <InputSmall
              value={newRelationLabel}
              onChange={(event) => setNewRelationLabel(event.target.value)}
              placeholder="Uses / Читает и пишет / Отправляет"
            />
          </label>

          <label className="space-y-1 text-xs text-(--color-foreground-dim)">
            Technology / Protocol
            <InputSmall
              value={newRelationTechnology}
              onChange={(event) => setNewRelationTechnology(event.target.value)}
              placeholder="HTTPS, JDBC, AMQP"
            />
          </label>

          <label className="space-y-1 text-xs text-(--color-foreground-dim)">
            Description
            <InputBig
              value={newRelationDescription}
              onChange={(event) =>
                setNewRelationDescription(event.target.value)
              }
              placeholder="Дополнительная детализация связи"
            />
          </label>

          {formError ? (
            <p className="text-xs text-rose-400">{formError}</p>
          ) : null}
        </div>
      </Modal>
    </div>
  );
}
