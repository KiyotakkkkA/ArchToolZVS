"use client";

import { useMemo, useRef } from "react";

type C4CodeEditorProps = {
    value: string;
    onChange: (nextValue: string) => void;
    className?: string;
};

type HighlightTokenType =
    | "keyword"
    | "directive"
    | "string"
    | "comment"
    | "plain";

type HighlightToken = {
    type: HighlightTokenType;
    value: string;
};

const highlightPattern =
    /(@startuml|@enduml|!includeurl?|!theme|!define)|('.*$|\/\/.*$)|("[^"\\]*(?:\\.[^"\\]*)*")|\b(Person_Ext|Person|System_Ext|System|ContainerDb|ContainerQueue_Ext|ContainerQueue|Container_Ext|Container|Component_Ext|Component|Boundary|Enterprise_Boundary|System_Boundary|Container_Boundary|Deployment_Node|Node_L|Node_R|Node|Rel_Up|Rel_Down|Rel_Left|Rel_Right|Rel|BiRel_Up|BiRel_Down|BiRel_Left|BiRel_Right|BiRel)\b/gm;

function tokenizeC4Code(value: string): HighlightToken[] {
    if (!value) {
        return [{ type: "plain", value: "" }];
    }

    const tokens: HighlightToken[] = [];
    let lastIndex = 0;

    for (const match of value.matchAll(highlightPattern)) {
        const matchedText = match[0] ?? "";
        const index = match.index ?? 0;

        if (index > lastIndex) {
            tokens.push({
                type: "plain",
                value: value.slice(lastIndex, index),
            });
        }

        let type: HighlightTokenType = "plain";
        if (match[1]) {
            type = "directive";
        } else if (match[2]) {
            type = "comment";
        } else if (match[3]) {
            type = "string";
        } else if (match[4]) {
            type = "keyword";
        }

        tokens.push({ type, value: matchedText });
        lastIndex = index + matchedText.length;
    }

    if (lastIndex < value.length) {
        tokens.push({ type: "plain", value: value.slice(lastIndex) });
    }

    return tokens;
}

function tokenClassName(type: HighlightTokenType): string {
    switch (type) {
        case "directive":
            return "text-fuchsia-300";
        case "comment":
            return "text-emerald-300/85";
        case "string":
            return "text-amber-300";
        case "keyword":
            return "text-indigo-300";
        default:
            return "text-(--color-foreground)";
    }
}

export function C4CodeEditor({
    value,
    onChange,
    className = "",
}: C4CodeEditorProps) {
    const highlightRef = useRef<HTMLPreElement>(null);
    const editorRef = useRef<HTMLTextAreaElement>(null);

    const tokens = useMemo(() => tokenizeC4Code(value), [value]);

    return (
        <div
            className={`relative w-full overflow-hidden rounded-lg border border-(--color-border) bg-(--color-background-elevated) ${className}`}
        >
            <pre
                ref={highlightRef}
                aria-hidden
                className="pointer-events-none absolute inset-0 m-0 overflow-auto px-3 py-3 font-mono text-sm leading-relaxed"
            >
                <code>
                    {tokens.map((token, index) => (
                        <span
                            key={`${index}-${token.type}`}
                            className={tokenClassName(token.type)}
                        >
                            {token.value}
                        </span>
                    ))}
                    {value.endsWith("\n") ? "\n" : null}
                </code>
            </pre>

            <textarea
                ref={editorRef}
                value={value}
                spellCheck={false}
                onChange={(event) => onChange(event.target.value)}
                onScroll={(event) => {
                    if (!highlightRef.current) {
                        return;
                    }
                    highlightRef.current.scrollTop =
                        event.currentTarget.scrollTop;
                    highlightRef.current.scrollLeft =
                        event.currentTarget.scrollLeft;
                }}
                className="relative z-10 h-full min-h-24 w-full resize-y bg-transparent px-3 py-3 font-mono text-sm leading-relaxed text-transparent caret-(--color-foreground) outline-none transition-all duration-200 selection:bg-indigo-500/25"
            />
        </div>
    );
}
