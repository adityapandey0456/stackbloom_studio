import { readFile, mkdir, writeFile, rename } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { isAdmin } from "@/lib/auth";

export const runtime = "nodejs";

const statuses = ["New", "Contacted", "Quoted", "Won", "Lost"];

export async function PATCH(request: Request) {
  if (!(await isAdmin())) {
    return Response.json(
      { error: "Please log in again." },
      { status: 401 }
    );
  }

  if (
    request.headers.get("origin") !==
    new URL(request.url).origin
  ) {
    return Response.json(
      { error: "Request not allowed." },
      { status: 403 }
    );
  }

  let body;

  try {
    const text = await request.text();

    if (text.length > 1000) {
      return Response.json(
        { error: "Request too large." },
        { status: 413 }
      );
    }

    body = JSON.parse(text);
  } catch {
    return Response.json(
      { error: "Invalid request." },
      { status: 400 }
    );
  }

  if (
    typeof body?.id !== "string" ||
    !/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(
      body.id
    ) ||
    !statuses.includes(body.status)
  ) {
    return Response.json(
      { error: "Invalid enquiry or status." },
      { status: 400 }
    );
  }

  try {
    const content = await readFile(
      path.join(process.cwd(), "data", "enquiries.jsonl"),
      "utf8"
    );

    const exists = content
      .split(/\r?\n/)
      .filter((line) => line.trim())
      .some((line) => JSON.parse(line).id === body.id);

    if (!exists) {
      return Response.json(
        { error: "Enquiry not found." },
        { status: 404 }
      );
    }

    const directory = path.join(
      process.cwd(),
      "data",
      "enquiry-status"
    );

    await mkdir(directory, { recursive: true });

    const target = path.join(directory, `${body.id}.json`);
    const temporary = path.join(directory, `${randomUUID()}.tmp`);

    await writeFile(
      temporary,
      JSON.stringify({
        status: body.status,
        updatedAt: new Date().toISOString(),
      }),
      "utf8"
    );

    await rename(temporary, target);

    return Response.json({ success: true, status: body.status });
  } catch (error) {
    console.error("Status update failed:", error);

    return Response.json(
      { error: "Could not save the status. Please try again." },
      { status: 500 }
    );
  }
}