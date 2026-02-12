export type ChatRole = "user" | "assistant";

export type AiChatMessage = {
  id: string;
  role: ChatRole;
  model?: string;
  content: string;
  createdAt: number;
};

export type C4OperationType =
  | "add_element"
  | "add_relation"
  | "update_element"
  | "update_relation"
  | "note";

export type C4FillOperation = {
  type: C4OperationType;
  macro?: string;
  alias?: string;
  from?: string;
  to?: string;
  label?: string;
  details?: string;
};

export type FillC4DiagramToolResult = {
  summary: string;
  operations: C4FillOperation[];
  nextSource: string;
};

export type FillC4DiagramRequest = {
  userPrompt: string;
  currentSource: string;
  diagramType?: string;
};

export type FillC4DiagramResponse = FillC4DiagramToolResult & {
  model: string;
};

export type OllamaToolCall = {
  function?: {
    name?: string;
    arguments?: string | Record<string, unknown>;
  };
};

export type OllamaChatResponse = {
  message?: {
    content?: string;
    tool_calls?: OllamaToolCall[];
  };
};
