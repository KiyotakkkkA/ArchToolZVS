import "server-only";

import { readFile } from "node:fs/promises";
import path from "node:path";
import { FillC4DiagramTool } from "@/agent/tools/FillC4DiagramTool";
import type {
    C4OperationType,
    FillC4DiagramRequest,
    FillC4DiagramToolResult,
    OllamaChatResponse,
    OllamaToolCall,
} from "@/app/types/AI";

class AiServiceError extends Error {
    statusCode: number;

    constructor(message: string, statusCode = 500) {
        super(message);
        this.name = "AiServiceError";
        this.statusCode = statusCode;
    }
}

const DEFAULT_OLLAMA_BASE_URL = "https://ollama.com";
const DEFAULT_OLLAMA_MODEL = "gpt-oss:20b";

let systemPromptCache: string | null = null;

function safeText(value: unknown): string {
    return typeof value === "string" ? value.trim() : "";
}

const c4OperationTypes: C4OperationType[] = [
    "add_element",
    "add_relation",
    "update_element",
    "update_relation",
    "note",
];

function normalizeOperationType(value: unknown): C4OperationType {
    const normalized = safeText(value);
    return c4OperationTypes.includes(normalized as C4OperationType)
        ? (normalized as C4OperationType)
        : "note";
}

export class AiService {
    private readonly baseUrl: string;
    private readonly model: string;
    private readonly token: string;

    constructor() {
        this.baseUrl = (
            process.env.OLLAMA_BASE_URL?.trim() || DEFAULT_OLLAMA_BASE_URL
        ).replace(/\/+$/, "");
        this.model = process.env.OLLAMA_MODEL?.trim() || DEFAULT_OLLAMA_MODEL;
        this.token = process.env.OLLAMA_TOKEN?.trim() || "";

        if (!this.model) {
            throw new AiServiceError("OLLAMA_MODEL is not configured.", 500);
        }
    }

    async fillC4Diagram(
        input: FillC4DiagramRequest,
    ): Promise<FillC4DiagramToolResult> {
        const userPrompt = safeText(input.userPrompt);
        const currentSource = String(input.currentSource || "");

        if (!userPrompt) {
            throw new AiServiceError("Поле userPrompt не заполнено.", 422);
        }

        const systemPrompt = await this.getSystemPrompt();

        const payload = {
            model: this.model,
            stream: false,
            options: {
                temperature: 0.2,
            },
            messages: [
                {
                    role: "system",
                    content: systemPrompt,
                },
                {
                    role: "user",
                    content: JSON.stringify(
                        {
                            task: "update_c4_diagram",
                            diagramType: input.diagramType || "container",
                            userPrompt,
                            currentSource,
                        },
                        null,
                        2,
                    ),
                },
            ],
            tools: [FillC4DiagramTool.get()],
        };

        const response = await this.requestChat(payload);
        const toolCall = this.findToolCall(response, "fill_c4_diagram");

        if (toolCall) {
            const parsed = this.parseToolArguments(toolCall);
            return this.normalizeToolResult(parsed, currentSource);
        }

        const rawContent = safeText(response.message?.content);
        if (rawContent) {
            try {
                const parsed = JSON.parse(rawContent) as Record<
                    string,
                    unknown
                >;
                return this.normalizeToolResult(parsed, currentSource);
            } catch {
                throw new AiServiceError(
                    "Ollama вернул невалидный JSON без tool_calls(fill_c4_diagram).",
                    502,
                );
            }
        }

        throw new AiServiceError(
            "Ollama не вернул tool_calls(fill_c4_diagram) и не вернул JSON fallback.",
            502,
        );
    }

    getModelName(): string {
        return this.model;
    }

    private async getSystemPrompt(): Promise<string> {
        if (systemPromptCache) {
            return systemPromptCache;
        }

        const promptPath = path.join(
            process.cwd(),
            "docs",
            "prompts",
            "SYSTEM_PROMPT.md",
        );

        const c4DocPath = path.join(process.cwd(), "agent", "docs", "C4.md");

        const fallback = [
            "Ты AI ассистент по C4-PlantUML.",
            "Используй tool fill_c4_diagram.",
            "Всегда учитывай currentSource.",
            "Возвращай summary, operations, nextSource.",
        ].join("\n");

        let systemPrompt = fallback;
        try {
            const content = await readFile(promptPath, "utf8");
            const normalized = content.trim();
            if (normalized) {
                systemPrompt = normalized;
            }
        } catch {
            systemPrompt = fallback;
        }

        let c4Doc = "";
        try {
            c4Doc = (await readFile(c4DocPath, "utf8")).trim();
        } catch {
            c4Doc = "";
        }

        systemPromptCache = c4Doc
            ? `${systemPrompt}\n\n---\n\n# C4 Reference\n\n${c4Doc}`
            : systemPrompt;

        return systemPromptCache;
    }

    private async requestChat(payload: Record<string, unknown>) {
        const headers: Record<string, string> = {
            "Content-Type": "application/json",
        };

        if (this.token) {
            headers.Authorization = `Bearer ${this.token}`;
        }

        const endpoint = `${this.baseUrl}/api/chat`;
        const response = await fetch(endpoint, {
            method: "POST",
            headers,
            body: JSON.stringify(payload),
            cache: "no-store",
            signal: AbortSignal.timeout(120_000),
        });

        if (!response.ok) {
            const text = await response.text();
            throw new AiServiceError(
                `Ollama /api/chat failed: ${response.status} ${response.statusText}${text ? ` - ${text}` : ""}`,
                502,
            );
        }

        const data = (await response.json()) as OllamaChatResponse;
        return data;
    }

    private findToolCall(
        data: OllamaChatResponse,
        expectedName: string,
    ): OllamaToolCall | null {
        const toolCalls = data.message?.tool_calls;
        if (!Array.isArray(toolCalls)) {
            return null;
        }

        for (const call of toolCalls) {
            if (call.function?.name === expectedName) {
                return call;
            }
        }

        return null;
    }

    private parseToolArguments(
        toolCall: OllamaToolCall,
    ): Record<string, unknown> {
        const args = toolCall.function?.arguments;
        if (!args) {
            return {};
        }

        if (typeof args === "string") {
            try {
                const parsed = JSON.parse(args) as Record<string, unknown>;
                return parsed;
            } catch {
                return {};
            }
        }

        return typeof args === "object" ? args : {};
    }

    private normalizeToolResult(
        raw: Record<string, unknown>,
        currentSource: string,
    ): FillC4DiagramToolResult {
        const summary =
            safeText(raw.summary) || "Изменения диаграммы рассчитаны.";
        const nextSource = safeText(raw.nextSource) || currentSource;

        const rawOperations = Array.isArray(raw.operations)
            ? raw.operations
            : [];
        const operations = rawOperations
            .filter(
                (entry): entry is Record<string, unknown> =>
                    typeof entry === "object" && entry !== null,
            )
            .map((entry) => ({
                type: normalizeOperationType(entry.type),
                macro: safeText(entry.macro) || undefined,
                alias: safeText(entry.alias) || undefined,
                from: safeText(entry.from) || undefined,
                to: safeText(entry.to) || undefined,
                label: safeText(entry.label) || undefined,
                details: safeText(entry.details) || undefined,
            }));

        return {
            summary,
            operations,
            nextSource,
        };
    }
}

export { AiServiceError };
