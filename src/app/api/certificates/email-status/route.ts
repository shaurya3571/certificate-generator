import { NextResponse } from "next/server";

import {
  updateCertificateEmailStatus,
} from "@/lib/supabase/certificates";
import {
  createSupabaseServerClient,
  getAuthenticatedUser,
} from "@/lib/supabase/server";

export const runtime = "nodejs";

interface EmailStatusRequest {
  certificateId: string;
  status: "pending" | "sent" | "failed";
  error?: string | null;
}

export async function PATCH(request: Request) {
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
      (await request.json()) as EmailStatusRequest;

    if (!body.certificateId?.trim()) {
      return NextResponse.json(
        {
          error: "Certificate ID is required.",
        },
        { status: 400 },
      );
    }

    if (
      body.status !== "pending" &&
      body.status !== "sent" &&
      body.status !== "failed"
    ) {
      return NextResponse.json(
        {
          error: "Invalid email status.",
        },
        { status: 400 },
      );
    }

    const certificate =
      await updateCertificateEmailStatus(
        body.certificateId,
        body.status,
        body.error ?? null,
        serverSupabase,
      );

    return NextResponse.json({
      success: true,
      certificate,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unable to update email status.",
      },
      { status: 500 },
    );
  }
}