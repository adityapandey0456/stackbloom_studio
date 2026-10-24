import "server-only";

import {
  createHmac,
  randomBytes,
  scryptSync,
  timingSafeEqual,
} from "node:crypto";
import { cookies } from "next/headers";

export const SESSION_COOKIE = "aditya_admin";
export const SESSION_SECONDS = 60 * 60 * 8;

function getSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET;

  if (!secret || secret.length < 32) {
    throw new Error("Admin session secret is missing.");
  }

  return secret;
}

export function verifyPassword(password: string) {
  const stored = process.env.ADMIN_PASSWORD_HASH;

  if (!stored || password.length > 256) return false;

  const [salt, hash] = stored.split(":");

  if (!salt || !/^[a-f0-9]{128}$/i.test(hash || "")) {
    return false;
  }

  const actual = scryptSync(password, salt, 64);
  const expected = Buffer.from(hash, "hex");

  return timingSafeEqual(actual, expected);
}

export function createSession() {
  const payload = Buffer.from(
    JSON.stringify({
      role: "admin",
      expires: Date.now() + SESSION_SECONDS * 1000,
      nonce: randomBytes(16).toString("hex"),
    })
  ).toString("base64url");

  const signature = createHmac("sha256", getSecret())
    .update(payload)
    .digest("base64url");

  return `${payload}.${signature}`;
}

export async function isAdmin() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;

  if (!token) return false;

  try {
    const parts = token.split(".");

    if (parts.length !== 2) return false;

    const [payload, signature] = parts;

    const expected = createHmac("sha256", getSecret())
      .update(payload)
      .digest();

    const actual = Buffer.from(signature, "base64url");

    if (
      actual.length !== expected.length ||
      !timingSafeEqual(actual, expected)
    ) {
      return false;
    }

    const session = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8")
    );

    return (
      session.role === "admin" &&
      typeof session.expires === "number" &&
      session.expires > Date.now()
    );
  } catch {
    return false;
  }
}