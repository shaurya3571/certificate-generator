import { NextResponse } from "next/server";

import { sendBulkCertificateEmails } from "@/lib/email/bulk-sender";
import type { Participant, TemplateType } from "@/types/certificate";

interface RequestParticipant {
  participant: Participant;
  certificateId?: string;
}

interface SendBulkRequest {
  eventName: string;
  template: TemplateType;
  participants: RequestParticipant[];
}

export async function POST(request: Request) {
  try {
    const body =
      (await request.json()) as SendBulkRequest;

    if (!body.eventName?.trim()) {
      return NextResponse.json(
        { error: "Event name is required." },
        { status: 400 },
      );
    }

    if (
      body.template !== "classic" &&
      body.template !== "modern"
    ) {
      return NextResponse.json(
        { error: "A valid template is required." },
        { status: 400 },
      );
    }

    if (
      !Array.isArray(body.participants) ||
      body.participants.length === 0
    ) {
      return NextResponse.json(
        { error: "At least one participant is required." },
        { status: 400 },
      );
    }

    const results =
      await sendBulkCertificateEmails({
        eventName: body.eventName.trim(),
        template: body.template,
        participants: body.participants,
      });

    const successful = results.filter(
      (item) => item.success,
    ).length;

    const failed = results.length - successful;

    return NextResponse.json({
      success: failed === 0,
      total: results.length,
      successful,
      failed,
      results,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to send certificate emails.",
      },
      { status: 500 },
    );
  }
}