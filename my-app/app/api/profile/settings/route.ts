import { NextResponse } from "next/server";
import { userSettings } from "@/app/db/schema";
import { db } from "@/app/lib/db";
import { auth } from "@/app/lib/auth";
import { settingsPatchSchema } from "@/schemas/profile";

export async function PATCH(request: Request) {
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

  const parsed = settingsPatchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid settings." },
      { status: 400 },
    );
  }

  const values = {
    userId: session.user.id,
    ...parsed.data.notifications,
    ...parsed.data.privacy,
  };
  const updates = {
    ...parsed.data.notifications,
    ...parsed.data.privacy,
    updatedAt: new Date(),
  };

  await db
    .insert(userSettings)
    .values(values)
    .onConflictDoUpdate({ target: userSettings.userId, set: updates });

  return NextResponse.json({ ok: true });
}