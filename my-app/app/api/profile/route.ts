import { NextResponse } from "next/server";
import { auth } from "@/app/lib/auth";
import { getProfileData } from "@/features/profile/queries";
import { deleteAccountSchema, updateProfileSchema } from "@/schemas/profile";

export async function GET(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return NextResponse.json({ message: "Please sign in." }, { status: 401 });
  }

  const profileData = await getProfileData(session.user);
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

  try {
    const emailChanged =
      parsed.data.email !== session.user.email.trim().toLowerCase();

    if (emailChanged) {
      await auth.api.changeEmail({
        body: {
          newEmail: parsed.data.email,
          callbackURL: new URL("/profile", process.env.BETTER_AUTH_URL).toString(),
        },
        headers: request.headers,
      });
    }

    await auth.api.updateUser({
      body: { name: parsed.data.name },
      headers: request.headers,
    });
    return NextResponse.json({
      ok: true,
      ...(emailChanged
        ? { message: "Check your current email to confirm the address change." }
        : {}),
    });
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