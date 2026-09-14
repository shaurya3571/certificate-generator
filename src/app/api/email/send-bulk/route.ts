import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/supabase/server";
import { sendGenericBulkEmails } from "@/lib/email/bulk-sender";
import type { BulkEmailRecipient } from "@/lib/email/types";

// ---------------------------------------------------------------------------
// POST /api/email/send-bulk
//
// Authenticated endpoint — requires a valid Supabase JWT in the
// Authorization: Bearer <token> header.
//
// Body:
//   {
//     recipients: { name?: string; email: string }[];
//     subject:    string;
//     message:    string;
//   }
//
// Response (200):
//   { sent: number; failed: number }
//
// Security notes:
//  - Organizer identity is verified server-side from the JWT.
//  - RESEND_API_KEY never leaves the server.
//  - Each recipient receives an individual email (no CC / BCC exposure).
//  - CSV contents are not stored in the database.
// ---------------------------------------------------------------------------

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidEmail(email: string): boolean {
  return EMAIL_PATTERN.test(email.trim());
}

export async function POST(request: Request) {
  // ── Authentication ────────────────────────────────────────────────────────
  const { user } = await getAuthenticatedUser(request);

  if (!user) {
    return NextResponse.json(
      { error: "Authentication required." },
      { status: 401 },
    );
  }

  // ── Parse body ────────────────────────────────────────────────────────────
  let body: {
    recipients?: unknown;
    subject?: unknown;
    message?: unknown;
  };

  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 },
    );
  }

  // ── Validate recipients ───────────────────────────────────────────────────
  if (
    !Array.isArray(body.recipients) ||
    body.recipients.length === 0
  ) {
    return NextResponse.json(
      { error: "At least one recipient is required." },
      { status: 400 },
    );
  }

  const recipients: BulkEmailRecipient[] = [];

  for (const item of body.recipients as Array<Record<string, unknown>>) {
    const email =
      typeof item.email === "string"
        ? item.email.trim().toLowerCase()
        : "";

    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        {
          error: `Invalid recipient email: ${email || "(empty)"}`,
        },
        { status: 400 },
      );
    }

    const name =
      typeof item.name === "string" && item.name.trim()
        ? item.name.trim()
        : undefined;

    recipients.push({ email, name });
  }

  // ── Validate subject ──────────────────────────────────────────────────────
  if (
    typeof body.subject !== "string" ||
    !body.subject.trim()
  ) {
    return NextResponse.json(
      { error: "Subject is required." },
      { status: 400 },
    );
  }

  // ── Validate message ──────────────────────────────────────────────────────
  if (
    typeof body.message !== "string" ||
    !body.message.trim()
  ) {
    return NextResponse.json(
      { error: "Message is required." },
      { status: 400 },
    );
  }

  // ── Send emails ───────────────────────────────────────────────────────────
  try {
    const results = await sendGenericBulkEmails({
      recipients,
      subject: body.subject.trim(),
      message: body.message.trim(),
    });

    const sent = results.filter((r) => r.success).length;
    const failed = results.length - sent;

    return NextResponse.json({
      sent,
      failed,
      // Per-recipient breakdown so the client can show exactly which
      // addresses failed and display the Resend error reason.
      results: results.map((r) => ({
        email: r.email,
        success: r.success,
        ...(r.error ? { error: r.error } : {}),
      })),
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to send emails.",
      },
      { status: 500 },
    );
  }
}