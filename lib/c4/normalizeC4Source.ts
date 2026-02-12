const includeMap = {
  context: "!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Context.puml",
  container: "!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Container.puml",
  component: "!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Component.puml",
  deployment: "!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Deployment.puml",
} as const;

type DiagramType = keyof typeof includeMap;

function normalizeInput(raw: string) {
  return raw
    .replace(/```(?:plantuml|puml)?/gi, "")
    .replace(/```/g, "")
    .replace(/\r\n/g, "\n")
    .trim();
}

function hasStartEndUml(source: string) {
  return /@startuml/i.test(source) && /@enduml/i.test(source);
}

function hasC4Include(source: string) {
  return /!include\s+.*C4_(Context|Container|Component|Deployment)\.puml/i.test(source);
}

function hasLayoutHint(source: string) {
  return /(LAYOUT_WITH_LEGEND|LAYOUT_LEFT_RIGHT|LAYOUT_LANDSCAPE|LAYOUT_TOP_DOWN)\s*\(/i.test(source);
}

export function normalizeC4Source(raw: string, diagramType: DiagramType) {
  const source = normalizeInput(raw);

  if (!source) {
    return "";
  }

  const lines: string[] = [];
  const hasWrappers = hasStartEndUml(source);

  if (!hasWrappers) {
    lines.push("@startuml");
  }

  if (!hasC4Include(source)) {
    lines.push(includeMap[diagramType]);
  }

  if (!hasLayoutHint(source)) {
    lines.push("LAYOUT_WITH_LEGEND()");
    lines.push("LAYOUT_LANDSCAPE()");
  }

  lines.push(source);

  if (!hasWrappers) {
    lines.push("@enduml");
  }

  return lines.join("\n\n");
}

export type { DiagramType };
