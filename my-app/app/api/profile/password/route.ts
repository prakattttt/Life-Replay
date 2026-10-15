import { NextResponse } from "next/server";
import { auth } from "@/app/lib/auth";
import { changePasswordSchema } from "@/schemas/profile";

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return NextResponse.json({ ok: false, message: "Please sign in." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid request body." }, { status: 400 });
  }

  const parsed = changePasswordSchema.safeParse(body);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0];
      if (typeof field === "string") fieldErrors[field] ??= issue.message;
    }
    return NextResponse.json(
      { ok: false, message: "Please check the highlighted fields.", fieldErrors },
      { status: 400 },
    );
  }

  try {
    await auth.api.changePassword({
      body: {
        currentPassword: parsed.data.currentPassword,
        newPassword: parsed.data.newPassword,
      },
      headers: request.headers,
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        message: "The current password could not be verified.",
        fieldErrors: { currentPassword: "Check your current password." },
      },
      { status: 400 },
    );
  }
}