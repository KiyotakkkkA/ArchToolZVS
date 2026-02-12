import type { DiagramType } from "@/lib/c4/normalizeC4Source";

export const c4EntityTypeOptionsByDiagram: Record<
  DiagramType,
  { value: string; label: string }[]
> = {
  context: [
    { value: "Person", label: "Пользователь" },
    { value: "Person_Ext", label: "Внешний пользователь" },
    { value: "System", label: "Система" },
    { value: "System_Ext", label: "Внешняя система" },
    { value: "SystemDb", label: "Система БД" },
    { value: "SystemDb_Ext", label: "Внешняя система БД" },
    { value: "SystemQueue", label: "Система Очереди" },
    { value: "SystemQueue_Ext", label: "Внешняя система Очереди" },
    { value: "Boundary", label: "Граница" },
    { value: "Enterprise_Boundary", label: "Граница предприятия" },
    { value: "System_Boundary", label: "Граница системы" },
  ],
  container: [
    { value: "Person", label: "Пользователь" },
    { value: "Person_Ext", label: "Внешний пользователь" },
    { value: "System", label: "Система" },
    { value: "System_Ext", label: "Внешняя система" },
    { value: "Container", label: "Контейнер" },
    { value: "Container_Ext", label: "Внешний контейнер" },
    { value: "ContainerDb", label: "Контейнер БД" },
    { value: "ContainerDb_Ext", label: "Внешний контейнер БД" },
    { value: "ContainerQueue", label: "Контейнер Очереди" },
    { value: "ContainerQueue_Ext", label: "Внешний контейнер Очереди" },
    { value: "Boundary", label: "Граница" },
    { value: "Enterprise_Boundary", label: "Граница предприятия" },
    { value: "System_Boundary", label: "Граница системы" },
    { value: "Container_Boundary", label: "Граница контейнера" },
  ],
  component: [
    { value: "Person", label: "Пользователь" },
    { value: "Person_Ext", label: "Внешний пользователь" },
    { value: "System", label: "Система" },
    { value: "System_Ext", label: "Внешняя система" },
    { value: "Container", label: "Контейнер" },
    { value: "Container_Ext", label: "Внешний контейнер" },
    { value: "Component", label: "Компонент" },
    { value: "Component_Ext", label: "Внешний компонент" },
    { value: "ComponentDb", label: "Компонент БД" },
    { value: "ComponentDb_Ext", label: "Внешний компонент БД" },
    { value: "ComponentQueue", label: "Компонент Очереди" },
    { value: "ComponentQueue_Ext", label: "Внешний компонент Очереди" },
    { value: "Boundary", label: "Граница" },
    { value: "Enterprise_Boundary", label: "Граница предприятия" },
    { value: "System_Boundary", label: "Граница системы" },
    { value: "Container_Boundary", label: "Граница контейнера" },
  ],
  deployment: [
    { value: "Person", label: "Пользователь" },
    { value: "Person_Ext", label: "Внешний пользователь" },
    { value: "System", label: "Система" },
    { value: "System_Ext", label: "Внешняя система" },
    { value: "Container", label: "Контейнер" },
    { value: "Container_Ext", label: "Внешний контейнер" },
    { value: "ContainerDb", label: "Контейнер БД" },
    { value: "ContainerDb_Ext", label: "Внешний контейнер БД" },
    { value: "Deployment_Node", label: "Узел развертывания" },
    { value: "Node", label: "Узел" },
    { value: "Node_L", label: "Узел Л" },
    { value: "Node_R", label: "Узел П" },
    { value: "Boundary", label: "Граница" },
    { value: "Enterprise_Boundary", label: "Граница предприятия" },
    { value: "System_Boundary", label: "Граница системы" },
    { value: "Container_Boundary", label: "Граница контейнера" },
  ],
};

export const c4RelationshipTypeOptions = [
  { value: "Rel", label: "Rel" },
  { value: "Rel_U", label: "Rel_U" },
  { value: "Rel_D", label: "Rel_D" },
  { value: "Rel_L", label: "Rel_L" },
  { value: "Rel_R", label: "Rel_R" },
  { value: "Rel_Neighbor", label: "Rel_Neighbor" },
  { value: "BiRel", label: "BiRel" },
  { value: "BiRel_U", label: "BiRel_U" },
  { value: "BiRel_D", label: "BiRel_D" },
  { value: "BiRel_L", label: "BiRel_L" },
  { value: "BiRel_R", label: "BiRel_R" },
] as const;

const boundaryTypes = new Set([
  "Boundary",
  "Enterprise_Boundary",
  "System_Boundary",
  "Container_Boundary",
  "Deployment_Node",
  "Node",
  "Node_L",
  "Node_R",
]);

type C4EntityNode = {
  alias: string;
  label: string;
  type: string;
  parentAlias: string | null;
  lineIndex: number;
  endLineIndex?: number;
};

type ParsedC4Source = {
  nodes: C4EntityNode[];
  boundaries: C4EntityNode[];
  aliases: Set<string>;
  lines: string[];
};

type AddElementInput = {
  type: string;
  alias: string;
  label: string;
  technology?: string;
  description?: string;
  parentAlias: string;
};

type AddRelationInput = {
  type: string;
  fromAlias: string;
  toAlias: string;
  label: string;
  technology?: string;
  description?: string;
};

const relationMacroPattern = /^(BiRel(?:_[A-Za-z]+)?|Rel(?:_[A-Za-z]+)?)$/;

function splitMacroArgs(raw: string): string[] {
  const parts: string[] = [];
  let current = "";
  let inQuote = false;

  for (let i = 0; i < raw.length; i += 1) {
    const char = raw[i];
    if (char === '"') {
      inQuote = !inQuote;
      current += char;
      continue;
    }
    if (!inQuote && char === ",") {
      parts.push(current.trim());
      current = "";
      continue;
    }
    current += char;
  }

  if (current.trim()) {
    parts.push(current.trim());
  }
  return parts;
}

function unquote(value: string): string {
  const trimmed = value.trim();
  if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function quote(value: string): string {
  const escaped = value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
  return `"${escaped}"`;
}

function normalizeArgName(name: string): string {
  return name.trim().replace(/^\$/, "").toLowerCase();
}

function parseArgumentToken(token: string): {
  name: string | null;
  value: string;
} {
  let inQuote = false;

  for (let index = 0; index < token.length; index += 1) {
    const char = token[index];
    if (char === '"') {
      inQuote = !inQuote;
      continue;
    }

    if (!inQuote && char === "=") {
      const rawName = token.slice(0, index).trim();
      const rawValue = token.slice(index + 1).trim();
      if (/^\$?[A-Za-z_][A-Za-z0-9_]*$/.test(rawName)) {
        return {
          name: normalizeArgName(rawName),
          value: rawValue,
        };
      }
      break;
    }
  }

  return { name: null, value: token.trim() };
}

function parseMacroLine(line: string) {
  const match = line.match(
    /^\s*([A-Za-z_][A-Za-z0-9_]*)\s*\((.*)\)\s*(\{)?\s*$/,
  );
  if (!match) {
    return null;
  }

  const [, macro, argsRaw, hasOpenBrace] = match;
  const args = splitMacroArgs(argsRaw);

  const positional: string[] = [];
  const named = new Map<string, string>();

  args.forEach((arg) => {
    const parsedArg = parseArgumentToken(arg);
    if (parsedArg.name) {
      named.set(parsedArg.name, unquote(parsedArg.value));
      return;
    }
    positional.push(unquote(parsedArg.value));
  });

  const alias = named.get("alias") ?? positional[0] ?? "";
  const label = named.get("label") ?? positional[1] ?? "";

  if (!alias || !label) {
    return null;
  }

  return {
    macro,
    args,
    alias,
    label,
    hasOpenBrace: Boolean(hasOpenBrace),
  };
}

function isDirectiveLine(line: string) {
  const trimmed = line.trim();
  if (!trimmed) {
    return true;
  }

  return (
    trimmed.startsWith("@") ||
    trimmed.startsWith("!") ||
    trimmed.startsWith("'") ||
    trimmed.startsWith("LAYOUT_") ||
    trimmed.startsWith("SHOW_") ||
    trimmed.startsWith("HIDE_") ||
    trimmed.startsWith("title")
  );
}

function buildElementCall(input: AddElementInput): string {
  const args: string[] = [
    `$alias=${input.alias}`,
    `$label=${quote(input.label.trim())}`,
  ];

  const includeTechnology = !boundaryTypes.has(input.type);
  const technology = input.technology?.trim();
  const description = input.description?.trim();

  if (includeTechnology && technology) {
    const typeLikeMacros = /^Person(?:_Ext)?$|^System(?:_Ext)?$/.test(
      input.type,
    );
    const technologyArgName = typeLikeMacros ? "$type" : "$techn";
    args.push(`${technologyArgName}=${quote(technology)}`);
  }

  if (description) {
    args.push(`$descr=${quote(description)}`);
  }

  const suffix = boundaryTypes.has(input.type) ? " {" : "";
  return `${input.type}(${args.join(", ")})${suffix}`;
}

function buildRelationCall(input: AddRelationInput): string {
  const args: string[] = [
    `$from=${input.fromAlias}`,
    `$to=${input.toAlias}`,
    `$label=${quote(input.label.trim())}`,
  ];

  if (input.technology?.trim()) {
    args.push(`$techn=${quote(input.technology.trim())}`);
  }

  if (input.description?.trim()) {
    args.push(`$descr=${quote(input.description.trim())}`);
  }

  return `${input.type}(${args.join(", ")})`;
}

function findInsertBeforeRelations(lines: string[]) {
  const relationIndex = lines.findIndex((line) =>
    /^\s*(BiRel(?:_[UDLR])?|Rel(?:_[UDLR]|_Neighbor)?)\s*\(/.test(line),
  );
  if (relationIndex >= 0) {
    return relationIndex;
  }

  const endUmlIndex = lines.findIndex((line) => /@enduml/i.test(line));
  if (endUmlIndex >= 0) {
    return endUmlIndex;
  }

  return lines.length;
}

function findBoundaryCloseIndex(lines: string[], openIndex: number) {
  let depth = 0;

  for (let index = openIndex; index < lines.length; index += 1) {
    const line = lines[index];
    if (line.includes("{")) {
      depth += (line.match(/\{/g) ?? []).length;
    }
    if (line.includes("}")) {
      depth -= (line.match(/\}/g) ?? []).length;
      if (depth === 0) {
        return index;
      }
    }
  }

  return -1;
}

export function parseC4SourceStructure(source: string): ParsedC4Source {
  const lines = source.replace(/\r\n/g, "\n").split("\n");
  const nodes: C4EntityNode[] = [];
  const boundaries: C4EntityNode[] = [];
  const aliases = new Set<string>();

  const stack: { alias: string; lineIndex: number; type: string }[] = [];

  lines.forEach((line, lineIndex) => {
    if (isDirectiveLine(line)) {
      return;
    }

    const parsed = parseMacroLine(line);
    if (parsed && parsed.alias) {
      if (relationMacroPattern.test(parsed.macro)) {
        return;
      }

      const parentAlias =
        stack.length > 0 ? stack[stack.length - 1].alias : null;
      const node: C4EntityNode = {
        alias: parsed.alias,
        label: parsed.label,
        type: parsed.macro,
        parentAlias,
        lineIndex,
      };

      nodes.push(node);
      aliases.add(parsed.alias);

      if (parsed.hasOpenBrace) {
        boundaries.push(node);
        stack.push({
          alias: parsed.alias,
          lineIndex,
          type: parsed.macro,
        });
      }
      return;
    }

    const trimmed = line.trim();
    if (trimmed === "}" && stack.length > 0) {
      const boundary = stack.pop();
      if (boundary) {
        const found = boundaries.find(
          (entry) => entry.alias === boundary.alias,
        );
        if (found) {
          found.endLineIndex = lineIndex;
        }
      }
    }
  });

  return {
    nodes,
    boundaries,
    aliases,
    lines,
  };
}

export function addElementToC4Source(
  source: string,
  input: AddElementInput,
): string {
  const parsed = parseC4SourceStructure(source);
  const lines = [...parsed.lines];

  const newLine = buildElementCall(input);
  if (input.parentAlias === "__root__") {
    const insertIndex = findInsertBeforeRelations(lines);
    lines.splice(insertIndex, 0, newLine);
    if (boundaryTypes.has(input.type)) {
      lines.splice(insertIndex + 1, 0, "}");
    }
    return lines.join("\n");
  }

  const parentBoundary = parsed.boundaries.find(
    (node) => node.alias === input.parentAlias,
  );
  if (!parentBoundary) {
    return source;
  }

  const closeIndex =
    parentBoundary.endLineIndex ??
    findBoundaryCloseIndex(lines, parentBoundary.lineIndex);

  if (closeIndex < 0) {
    return source;
  }

  const openingLine = lines[parentBoundary.lineIndex] ?? "";
  const indent = openingLine.match(/^\s*/)?.[0] ?? "";
  const childIndent = `${indent}  `;

  lines.splice(closeIndex, 0, `${childIndent}${newLine}`);
  if (boundaryTypes.has(input.type)) {
    lines.splice(closeIndex + 1, 0, `${childIndent}}`);
  }

  return lines.join("\n");
}

export function addRelationToC4Source(
  source: string,
  input: AddRelationInput,
): string {
  const lines = source.replace(/\r\n/g, "\n").split("\n");
  const relationLine = buildRelationCall(input);

  const relationIndexes = lines
    .map((line, index) => ({
      index,
      isRel: /^\s*(BiRel(?:_[UDLR])?|Rel(?:_[UDLR]|_Neighbor)?)\s*\(/.test(
        line,
      ),
    }))
    .filter((entry) => entry.isRel)
    .map((entry) => entry.index);

  if (relationIndexes.length > 0) {
    lines.splice(
      relationIndexes[relationIndexes.length - 1] + 1,
      0,
      relationLine,
    );
    return lines.join("\n");
  }

  const insertIndex = findInsertBeforeRelations(lines);
  lines.splice(insertIndex, 0, relationLine);
  return lines.join("\n");
}

export type { C4EntityNode, ParsedC4Source, AddElementInput, AddRelationInput };
