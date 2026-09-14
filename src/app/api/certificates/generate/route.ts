import { NextResponse } from "next/server";

import {
  generateAndSaveCertificates,
} from "@/lib/certificate/generation-workflow";
import {
  createSupabaseServerClient,
  getAuthenticatedUser,
} from "@/lib/supabase/server";

import type {
  Participant,
  TemplateType,
} from "@/types/certificate";

export const runtime = "nodejs";

interface GenerateRequest {
  eventName: string;
  template: TemplateType;
  participants: Participant[];
  organizerId: string;
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
      (await request.json()) as GenerateRequest;

    if (!body.eventName?.trim()) {
      return NextResponse.json(
        {
          error: "Event name is required.",
        },
        { status: 400 },
      );
    }

    if (
      body.template !== "classic" &&
      body.template !== "modern"
    ) {
      return NextResponse.json(
        {
          error: "A valid template is required.",
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

    const result =
      await generateAndSaveCertificates(
        {
          eventName: body.eventName,
          template: body.template,
          participants: body.participants,
          organizerId: user.id,
        },
        serverSupabase,
      );

    return NextResponse.json({
      success: true,
      eventId: result.eventId,
      certificates: result.certificates.map(
        (certificate) => ({
          participant: certificate.participant,
          participantId:
            certificate.participantId,
          certificateId:
            certificate.certificateId,
          fileName: certificate.fileName,
        }),
      ),
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unable to generate certificates.",
      },
      { status: 500 },
    );
  }
}
