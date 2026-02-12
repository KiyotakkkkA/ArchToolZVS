"use client";

import Icon from "@mdi/react";
import {
  mdiHandBackRightOutline,
  mdiRobotExcitedOutline,
  mdiSend,
} from "@mdi/js";
import { Button } from "@/components/atoms/Button";
import { InputSmall } from "@/components/atoms/InputSmall";
import { Spinner } from "@/components/atoms/Spinner";
import type { AiChatMessage } from "@/app/types/AI";
import { UserMessageCard } from "@/components/molecules/cards/UserMessageCard";
import { AssistantMessageCard } from "@/components/molecules/cards/AssistantMessageCard";

type AiEditorViewProps = {
  messages: AiChatMessage[];
  inputValue: string;
  isLoading: boolean;
  errorText?: string;
  onInputChange: (value: string) => void;
  onSend: () => void;
  onBackToEditor: () => void;
};

export function AiEditorView({
  messages,
  inputValue,
  isLoading,
  errorText,
  onInputChange,
  onSend,
  onBackToEditor,
}: AiEditorViewProps) {
  return (
    <div className="space-y-3 animate-in fade-in slide-in-from-right-1 duration-200">
      <div className="flex items-center justify-between">
        <h2 className="inline-flex items-center gap-2 text-[1.75rem] font-semibold text-(--color-foreground)">
          <Icon path={mdiRobotExcitedOutline} size={0.95} aria-hidden />
          ИИ Ассистент
        </h2>
        <Button variant="outline" onClick={onBackToEditor}>
          <Icon path={mdiHandBackRightOutline} size={0.8} aria-hidden />В
          Редактор
        </Button>
      </div>

      <div className="rounded-xl border border-(--color-border) bg-(--color-background-elevated) p-3">
        <div className="max-h-[56vh] space-y-3 overflow-y-auto pr-1">
          {messages.map((message) => {
            const isUser = message.role === "user";

            if (isUser) {
              return (
                <UserMessageCard
                  key={message.id}
                  content={message.content}
                  createdAt={message.createdAt}
                />
              );
            }

            return (
              <AssistantMessageCard
                key={message.id}
                model={message.model}
                content={message.content}
                createdAt={message.createdAt}
              />
            );
          })}

          {isLoading ? (
            <div className="inline-flex max-w-[92%] rounded-2xl rounded-tl-md border border-(--color-border) bg-(--color-surface-2) px-3 py-2">
              <Spinner size="sm" label="Думаю..." />
            </div>
          ) : null}

          {errorText ? (
            <div className="max-w-[92%] rounded-2xl rounded-tl-md border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">
              {errorText}
            </div>
          ) : null}
        </div>
      </div>

      <div className="rounded-xl border border-(--color-border) bg-(--color-surface-2) p-2">
        <div className="flex items-center gap-2">
          <InputSmall
            value={inputValue}
            onChange={(event) => onInputChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                onSend();
              }
            }}
            placeholder="Опишите изменения для диаграммы..."
            className="h-9"
          />
          <Button
            aria-label="Отправить"
            className="px-2"
            size="sm"
            onClick={onSend}
            disabled={isLoading || !inputValue.trim()}
          >
            <Icon path={mdiSend} size={0.72} aria-hidden />
          </Button>
        </div>
      </div>
    </div>
  );
}
