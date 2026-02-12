export class FillC4DiagramTool {
  static get(): Record<string, unknown> {
    return {
      type: "function",
      function: {
        name: "fill_c4_diagram",
        description:
          "Обновляет C4-диаграмму на основе userPrompt и currentSource. Возвращает полный итоговый nextSource и список операций.",
        parameters: {
          type: "object",
          properties: {
            summary: {
              type: "string",
              description: "Краткое описание выполненных изменений.",
            },
            operations: {
              type: "array",
              description: "Список операций, применённых к диаграмме.",
              items: {
                type: "object",
                properties: {
                  type: {
                    type: "string",
                    enum: [
                      "add_element",
                      "add_relation",
                      "update_element",
                      "update_relation",
                      "note",
                    ],
                  },
                  macro: { type: "string" },
                  alias: { type: "string" },
                  from: { type: "string" },
                  to: { type: "string" },
                  label: { type: "string" },
                  details: { type: "string" },
                },
                required: ["type"],
              },
            },
            nextSource: {
              type: "string",
              description: "Полный итоговый код C4-диаграммы (PlantUML).",
            },
          },
          required: ["summary", "operations", "nextSource"],
        },
      },
    };
  }
}
