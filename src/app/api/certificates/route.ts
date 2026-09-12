import { NextResponse } from "next/server";

import {
  saveCertificates,
} from "@/lib/supabase/certificates";

export const runtime = "nodejs";

interface CertificateRequest {
  eventId: string;
  participantId: string;
  certificateId: string;
  fileName: string;
  emailStatus?: "pending" | "sent" | "failed";
  emailError?: string | null;
}

export async function POST(request: Request) {
  try {
    const body =
      (await request.json()) as CertificateRequest;

    if (!body.eventId?.trim()) {
      return NextResponse.json(
        {
          error: "Event ID is required.",
        },
        { status: 400 },
      );
    }

    if (!body.participantId?.trim()) {
      return NextResponse.json(
        {
          error: "Participant ID is required.",
        },
        { status: 400 },
      );
    }

    if (!body.certificateId?.trim()) {
      return NextResponse.json(
        {
          error: "Certificate ID is required.",
        },
        { status: 400 },
      );
    }

    if (!body.fileName?.trim()) {
      return NextResponse.json(
        {
          error: "Certificate file name is required.",
        },
        { status: 400 },
      );
    }

    if (
      body.emailStatus &&
      !["pending", "sent", "failed"].includes(
        body.emailStatus,
      )
    ) {
      return NextResponse.json(
        {
          error: "Invalid email status.",
        },
        { status: 400 },
      );
    }

    const certificates =
      await saveCertificates([
        {
          eventId: body.eventId,
          participantId: body.participantId,
          certificateId: body.certificateId,
          fileName: body.fileName,
          emailStatus:
            body.emailStatus ?? "pending",
          emailError:
            body.emailError ?? null,
        },
      ]);

    return NextResponse.json({
      success: true,
      certificate: certificates[0],
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unable to save certificate.",
      },
      { status: 500 },
    );
  }
}