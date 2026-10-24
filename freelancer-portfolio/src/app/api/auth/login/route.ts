import { NextResponse } from "next/server";
import {
  createSession,
  SESSION_COOKIE,
  SESSION_SECONDS,
  verifyPassword,
} from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const origin = request.headers.get("origin");

  if (origin !== new URL(request.url).origin) {
    return NextResponse.json(
      { error: "Request not allowed." },
      { status: 403 }
    );
  }

  try {
    const text = await request.text();

    if (text.length > 2000) {
      return NextResponse.json(
        { error: "Invalid request." },
        { status: 413 }
      );
    }

    const body = JSON.parse(text);

    if (
      typeof body?.password !== "string" ||
      !verifyPassword(body.password)
    ) {
      return NextResponse.json(
        { error: "Incorrect password." },
        { status: 401 }
      );
    }

    const response = NextResponse.json({ success: true });

    response.cookies.set(SESSION_COOKIE, createSession(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: SESSION_SECONDS,
    });

    response.headers.set("Cache-Control", "no-store");

    return response;
  } catch {
    return NextResponse.json(
      { error: "Login failed. Check server configuration." },
      { status: 500 }
    );
  }
}