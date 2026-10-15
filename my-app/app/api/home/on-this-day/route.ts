import { NextResponse } from "next/server";
import { auth } from "@/app/lib/auth";
import { getOnThisDayMoments } from "@/features/home/queries";

export async function GET(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return NextResponse.json({ message: "Please sign in." }, { status: 401 });
  }

  const data = await getOnThisDayMoments(session.user.id);
  return NextResponse.json(data);
}