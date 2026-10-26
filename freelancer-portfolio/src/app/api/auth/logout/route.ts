import { NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/lib/auth";

export const runtime = "nodejs";

const allowedOrigins = new Set([
  "https://stackbloomstudio.space",
  "https://www.stackbloomstudio.space",
  "https://stackbloomstudio.netlify.app",
]);

function getAllowedOrigin(request: Request): string | null {
  const origin = request.headers.get("origin");

  if (!origin) return null;

  if (allowedOrigins.has(origin)) {
    return origin;
  }

  if (
    process.env.NODE_ENV !== "production" &&
    (
      origin === "http://localhost:3000" ||
      origin === "http://127.0.0.1:3000"
    )
  ) {
    return origin;
  }

  return null;
}

export async function POST(request: Request) {
  const origin = getAllowedOrigin(request);

  if (!origin) {
    return NextResponse.json(
      { error: "Request not allowed." },
      {
        status: 403,
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  }

  const response = NextResponse.redirect(
    new URL("/admin/login", origin),
    303
  );

  response.cookies.set(SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });

  response.headers.set("Cache-Control", "no-store");

  return response;
}