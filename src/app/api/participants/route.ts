import { NextResponse } from "next/server";

import { saveParticipants } from "@/lib/supabase/participants";
import type { Participant } from "@/types/certificate";

export const runtime = "nodejs";

interface SaveParticipantsRequest {
  eventId: string;
  participants: Participant[];
}

export async function POST(request: Request) {
  try {
    const body =
      (await request.json()) as SaveParticipantsRequest;

    if (!body.eventId?.trim()) {
      return NextResponse.json(
        {
          error: "Event ID is required.",
        },
        { status: 400 },
      );
    }

    if (
      !Array.isArray(body.participants) ||
      body.participants.length === 0
    ) {
      return NextResponse.json(
        {
          error: "At least one participant is required.",
        },
        { status: 400 },
      );
    }

    const participants =
      await saveParticipants({
        eventId: body.eventId,
        participants: body.participants,
      });

    return NextResponse.json({
      success: true,
      participants,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unable to save participants.",
      },
      { status: 500 },
    );
  }
}