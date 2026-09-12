import { NextResponse } from "next/server";

import { createEvent } from "@/lib/supabase/events";
import type { TemplateType } from "@/types/certificate";

export const runtime = "nodejs";

interface CreateEventRequest {
  name: string;
  template: TemplateType;
  organizerId: string;
}

export async function POST(request: Request) {
  try {
    const body =
      (await request.json()) as CreateEventRequest;

    if (!body.name?.trim()) {
      return NextResponse.json(
        {
          error: "Event name is required.",
        },
        { status: 400 },
      );
    }

    if (!body.organizerId?.trim()) {
      return NextResponse.json(
        {
          error: "Organizer ID is required.",
        },
        { status: 400 },
      );
    }

    if (
      body.template !== "classic" &&
      body.template !== "modern" &&
      body.template !== "custom"
    ) {
      return NextResponse.json(
        {
          error: "A valid template is required.",
        },
        { status: 400 },
      );
    }

    const event = await createEvent({
      name: body.name,
      template: body.template,
      organizerId: body.organizerId,
    });

    return NextResponse.json({
      success: true,
      event,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unable to create event.",
      },
      { status: 500 },
    );
  }
}