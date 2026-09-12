import { NextResponse } from "next/server";

import { supabase } from "@/lib/supabase/client";

export const runtime = "nodejs";

export async function GET() {
  try {
    const { error } = await supabase
      .from("events")
      .select("id")
      .limit(1);

    if (error) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Supabase connection successful.",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Supabase connection failed.",
      },
      { status: 500 },
    );
  }
}