import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/supabase/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { sendBulkCertificateEmails } from "@/lib/email/bulk-sender";
import type { TemplateType } from "@/types/certificate";

// ---------------------------------------------------------------------------
// POST /api/email/send-certificates
//
// Authenticated endpoint. Fetches saved participants for an event,
// generates a certificate PDF for each one, and emails it as an attachment.
//
// Body: { eventId: string; eventName: string; template: TemplateType }
//
// Response: { sent: number; failed: number;
//             results: { email: string; success: boolean; error?: string }[] }
// ---------------------------------------------------------------------------

export async function POST(request: Request) {
  // ── Auth ────────────────────────────────────────────────────────────────
  const { user, accessToken } =
    await getAuthenticatedUser(request);

  if (!user || !accessToken) {
    return NextResponse.json(
      { error: "Authentication required." },
      { status: 401 },
    );
  }

  // ── Parse body ────────────────────────────────────────────────────────────
  let body: {
    eventId?: unknown;
    eventName?: unknown;
    template?: unknown;
    retryEmails?: unknown;
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

  if (
    typeof body.eventId !== "string" ||
    !body.eventId.trim()
  ) {
    return NextResponse.json(
      { error: "eventId is required." },
      { status: 400 },
    );
  }

  if (
    typeof body.eventName !== "string" ||
    !body.eventName.trim()
  ) {
    return NextResponse.json(
      { error: "eventName is required." },
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

  const eventId = body.eventId.trim();
  const eventName = body.eventName.trim();
  const template = body.template as TemplateType;

  // ── Verify organizer owns this event ─────────────────────────────────────
  const supabase = createSupabaseServerClient(accessToken);

  const { data: eventRow, error: eventError } = await supabase
    .from("events")
    .select("id, organizer_id")
    .eq("id", eventId)
    .eq("organizer_id", user.id)
    .single();

  if (eventError || !eventRow) {
    return NextResponse.json(
      { error: "Event not found or access denied." },
      { status: 403 },
    );
  }

  // ── Fetch saved participants ──────────────────────────────────────────────
  const { data: participantRows, error: participantsError } =
    await supabase
      .from("participants")
      .select("name, email")
      .eq("event_id", eventId)
      .order("created_at", { ascending: true });

  if (participantsError) {
    return NextResponse.json(
      { error: "Unable to fetch participants." },
      { status: 500 },
    );
  }

  if (!participantRows || participantRows.length === 0) {
    return NextResponse.json(
      { error: "No saved participants found for this event." },
      { status: 400 },
    );
  }

  // If retryEmails is provided, only send to those addresses.
  const retrySet =
    Array.isArray(body.retryEmails) &&
    body.retryEmails.every((e) => typeof e === "string")
      ? new Set(
          (body.retryEmails as string[]).map((e) =>
            e.trim().toLowerCase(),
          ),
        )
      : null;

  const rows = retrySet
    ? participantRows.filter((p) =>
        retrySet.has((p.email as string).toLowerCase()),
      )
    : participantRows;

  if (rows.length === 0) {
    return NextResponse.json(
      { error: "No matching participants found to send to." },
      { status: 400 },
    );
  }

  const participants = rows.map((p) => ({
    participant: {
      name: p.name as string,
      email: p.email as string,
    },
  }));

  // ── Generate & send certificate emails ───────────────────────────────────
  try {
    const results = await sendBulkCertificateEmails({
      eventName,
      template,
      participants,
      subject: typeof body.subject === "string" ? body.subject : undefined,
      message: typeof body.message === "string" ? body.message : undefined,
    });

    const sent = results.filter((r) => r.success).length;
    const failed = results.length - sent;

    return NextResponse.json({
      sent,
      failed,
      results: results.map((r) => ({
        email: r.participant.email,
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
            : "Unable to send certificate emails.",
      },
      { status: 500 },
    );
  }
}
