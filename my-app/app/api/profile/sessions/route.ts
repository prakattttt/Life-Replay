import { NextResponse } from "next/server";
import { auth } from "@/app/lib/auth";

export async function DELETE(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return NextResponse.json({ ok: false, message: "Please sign in." }, { status: 401 });
  }

  try {
    await auth.api.revokeOtherSessions({ headers: request.headers });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { ok: false, message: "We couldn’t sign out your other devices." },
      { status: 500 },
    );
  }
}