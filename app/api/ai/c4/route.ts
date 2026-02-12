import { NextRequest, NextResponse } from "next/server";
import { AiService, AiServiceError } from "@/app/services/AiService";
import type {
  FillC4DiagramRequest,
  FillC4DiagramResponse,
} from "@/app/types/AI";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Partial<FillC4DiagramRequest>;

    const payload: FillC4DiagramRequest = {
      userPrompt: String(body.userPrompt || ""),
      currentSource: String(body.currentSource || ""),
      diagramType: body.diagramType ? String(body.diagramType) : undefined,
    };

    const service = new AiService();
    const result = await service.fillC4Diagram(payload);

    const response: FillC4DiagramResponse = {
      ...result,
      model: service.getModelName(),
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    if (error instanceof AiServiceError) {
      return NextResponse.json(
        {
          message: error.message,
        },
        { status: error.statusCode },
      );
    }

    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      {
        message,
      },
      { status: 500 },
    );
  }
}
