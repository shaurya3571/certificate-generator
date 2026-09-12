import { NextResponse } from "next/server";

import { sendBulkCertificateEmails } from "@/lib/email/bulk-sender";
import type { Participant, TemplateType } from "@/types/certificate";

interface SendBulkRequest {
  eventName: string;
  template: TemplateType;
  participants: Participant[];
}

export async function POST(request: Request) {
  try {
    const body =
      (await request.json()) as SendBulkRequest;

    if (
      !body.eventName?.trim() ||
      !body.template ||
      !Array.isArray(body.participants) ||
      body.participants.length === 0
    ) {
      return NextResponse.json(
        {
          error:
            "eventName, template and participants are required.",
        },
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
      (result) => result.success,
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
    console.error(
      "Bulk certificate email failed:",
      error,
    );

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