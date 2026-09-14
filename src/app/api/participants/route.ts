import { NextResponse } from "next/server";

import { saveParticipants } from "@/lib/supabase/participants";
import {
  createSupabaseServerClient,
  getAuthenticatedUser,
} from "@/lib/supabase/server";
import type { Participant } from "@/types/certificate";

export const runtime = "nodejs";

interface SaveParticipantsRequest {
  eventId: string;
  participants: Participant[];
}

export async function POST(request: Request) {
  try {
    const { user, accessToken } =
      await getAuthenticatedUser(request);

    if (!user || !accessToken) {
      return NextResponse.json(
        { error: "Authentication required." },
        { status: 401 },
      );
    }

    const serverSupabase =
      createSupabaseServerClient(accessToken);

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
      await saveParticipants(
        {
          eventId: body.eventId,
          participants: body.participants,
        },
        serverSupabase,
      );

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