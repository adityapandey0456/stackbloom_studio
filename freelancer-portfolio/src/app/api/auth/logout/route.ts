import { NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/lib/auth";

export async function POST(request: Request) {
  if (
    request.headers.get("origin") !==
    new URL(request.url).origin
  ) {
    return NextResponse.json(
      { error: "Request not allowed." },
      { status: 403 }
    );
  }

  const response = NextResponse.redirect(
    new URL("/admin/login", request.url),
    303
  );

  response.cookies.set(SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });

  return response;
}