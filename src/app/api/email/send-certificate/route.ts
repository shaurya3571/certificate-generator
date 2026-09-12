import { NextResponse } from "next/server";

import { generateCertificate } from "@/lib/certificate/generator";
import { generateCertificateId } from "@/lib/certificate/id";
import { sendCertificateEmail } from "@/lib/email/sender";

interface SendCertificateRequest {
  eventName: string;
  participantName: string;
  email: string;
  template: "classic" | "modern";
}

export async function POST(request: Request) {
  try {
    const body =
      (await request.json()) as SendCertificateRequest;

    if (
      !body.eventName?.trim() ||
      !body.participantName?.trim() ||
      !body.email?.trim() ||
      !body.template
    ) {
      return NextResponse.json(
        {
          error:
            "eventName, participantName, email and template are required.",
        },
        { status: 400 },
      );
    }

    const certificateId = generateCertificateId();

    const certificatePdf =
      await generateCertificate({
        eventName: body.eventName.trim(),
        participantName: body.participantName.trim(),
        certificateId,
        template: body.template,
      });

    const safeName = body.participantName
      .trim()
      .replace(/[^a-zA-Z0-9-_ ]/g, "")
      .replace(/\s+/g, "-");

    const fileName = `${safeName}-${certificateId}.pdf`;

    const emailResult =
      await sendCertificateEmail({
        to: body.email.trim(),
        participantName: body.participantName.trim(),
        eventName: body.eventName.trim(),
        certificateId,
        certificatePdf,
        fileName,
      });

    return NextResponse.json({
      success: true,
      certificateId,
      emailId: emailResult?.id ?? null,
    });
  } catch (error) {
    console.error(
      "Certificate email failed:",
      error,
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to send certificate email.",
      },
      { status: 500 },
    );
  }
}