import { count, eq, asc } from "drizzle-orm";
import { NextResponse } from "next/server";
import { moment, userSettings } from "@/app/db/schema";
import { db } from "@/app/lib/db";
import { auth } from "@/app/lib/auth";
import type { ProfileData } from "@/features/profile/types";
import { deleteAccountSchema, updateProfileSchema } from "@/schemas/profile";

export async function GET(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return NextResponse.json({ message: "Please sign in." }, { status: 401 });
  }

  const userId = session.user.id;
  const [[momentTotal], [firstMoment], [storedSettings]] = await Promise.all([
    db
      .select({ total: count() })
      .from(moment)
      .where(eq(moment.userId, userId)),
    db
      .select({ occurredOn: moment.occurredOn })
      .from(moment)
      .where(eq(moment.userId, userId))
      .orderBy(asc(moment.occurredAt))
      .limit(1),
    db
      .select({
        onThisDay: userSettings.onThisDay,
        onThisDayTime: userSettings.onThisDayTime,
        weeklyRecap: userSettings.weeklyRecap,
        blurPhotos: userSettings.blurPhotos,
        discreetEmails: userSettings.discreetEmails,
      })
      .from(userSettings)
      .where(eq(userSettings.userId, userId))
      .limit(1),
  ]);

  const profileData: ProfileData = {
    profile: {
      name: session.user.name,
      email: session.user.email,
      imageUrl: session.user.image ?? null,
      createdAt: session.user.createdAt,
      momentCount: momentTotal?.total ?? 0,
      firstMomentOn: firstMoment?.occurredOn ?? null,
    },
    settings: {
      notifications: {
        onThisDay: storedSettings?.onThisDay ?? true,
        onThisDayTime: (storedSettings?.onThisDayTime ?? "08:00") as ProfileData["settings"]["notifications"]["onThisDayTime"],
        weeklyRecap: storedSettings?.weeklyRecap ?? false,
      },
      privacy: {
        blurPhotos: storedSettings?.blurPhotos ?? false,
        discreetEmails: storedSettings?.discreetEmails ?? true,
      },
    },
  };

  return NextResponse.json(profileData);
}

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

  const parsed = updateProfileSchema.safeParse(body);
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

  if (parsed.data.email !== session.user.email.trim().toLowerCase()) {
    return NextResponse.json(
      {
        ok: false,
        message: "Email changes require a verification flow that is not configured yet.",
        fieldErrors: { email: "Email changes are not available yet." },
      },
      { status: 400 },
    );
  }

  try {
    await auth.api.updateUser({
      body: { name: parsed.data.name },
      headers: request.headers,
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { ok: false, message: "We couldn’t update your profile. Please try again." },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
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

  const parsed = deleteAccountSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, message: parsed.error.issues[0]?.message ?? "Confirm account deletion." },
      { status: 400 },
    );
  }

  try {
    await auth.api.deleteUser({
      body: { password: parsed.data.password },
      headers: request.headers,
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { ok: false, message: "We couldn’t delete your account. Check your password and try again." },
      { status: 400 },
    );
  }
}