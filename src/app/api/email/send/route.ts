import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    console.log("Email request:", body);

    return NextResponse.json({
      success: true,
      message: "Email sent successfully",
    });
  } catch (error) {
    console.error("Email error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to send email",
      },
      { status: 500 }
    );
  }
}