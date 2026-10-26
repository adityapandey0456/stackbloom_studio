import { NextResponse } from "next/server";
import {
  createSession,
  SESSION_COOKIE,
  SESSION_SECONDS,
  verifyPassword,
} from "@/lib/auth";

export const runtime = "nodejs";

const allowedOrigins = new Set([
  "https://stackbloomstudio.space",
  "https://www.stackbloomstudio.space",
  "https://stackbloomstudio.netlify.app",
]);

function isAllowedOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");

  if (!origin) return false;

  if (allowedOrigins.has(origin)) {
    return true;
  }

  if (process.env.NODE_ENV !== "production") {
    return (
      origin === "http://localhost:3000" ||
      origin === "http://127.0.0.1:3000"
    );
  }

  return false;
}

function jsonResponse(
  body: Record<string, unknown>,
  status: number
) {
  return NextResponse.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}

export async function POST(request: Request) {
  if (!isAllowedOrigin(request)) {
    return jsonResponse(
      { error: "Request not allowed." },
      403
    );
  }

  let body: unknown;

  try {
    const text = await request.text();

    if (text.length > 2000) {
      return jsonResponse(
        { error: "Invalid request." },
        413
      );
    }

    body = JSON.parse(text);
  } catch {
    return jsonResponse(
      { error: "Invalid request." },
      400
    );
  }

  if (
    !body ||
    typeof body !== "object" ||
    Array.isArray(body) ||
    !("password" in body) ||
    typeof body.password !== "string"
  ) {
    return jsonResponse(
      { error: "Please enter your password." },
      400
    );
  }

  try {
    if (!verifyPassword(body.password)) {
      return jsonResponse(
        { error: "Incorrect password." },
        401
      );
    }

    const response = jsonResponse(
      { success: true },
      200
    );

    response.cookies.set(
      SESSION_COOKIE,
      createSession(),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: SESSION_SECONDS,
      }
    );

    return response;
  } catch {
    console.error("ADMIN_LOGIN_FAILED");

    return jsonResponse(
      {
        error: "Login failed. Check server configuration.",
      },
      500
    );
  }
}