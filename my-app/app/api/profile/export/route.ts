import { asc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { moment, userSettings } from "@/app/db/schema";
import { db } from "@/app/lib/db";
import { auth } from "@/app/lib/auth";
import { exportRequestSchema } from "@/schemas/profile";

function csvCell(value: string | null): string {
  const text = value ?? "";
  const safeText = /^[\s\u0000-\u001f]*[=+\-@]/.test(text) ? `'${text}` : text;
  return `"${safeText.replaceAll('"', '""')}"`;
}

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return NextResponse.json({ message: "Please sign in." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid request body." }, { status: 400 });
  }

  const parsed = exportRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: "Choose a valid export format." }, { status: 400 });
  }

  const [moments, [settings]] = await Promise.all([
    db
      .select({
        title: moment.title,
        description: moment.description,
        category: moment.category,
        imageUrl: moment.imageUrl,
        occurredAt: moment.occurredAt,
        occurredOn: moment.occurredOn,
        timezone: moment.timezone,
        createdAt: moment.createdAt,
      })
      .from(moment)
      .where(eq(moment.userId, session.user.id))
      .orderBy(asc(moment.occurredOn), asc(moment.occurredAt)),
    db
      .select({
        timezone: userSettings.timezone,
        onThisDay: userSettings.onThisDay,
        onThisDayTime: userSettings.onThisDayTime,
        weeklyRecap: userSettings.weeklyRecap,
        blurPhotos: userSettings.blurPhotos,
        discreetEmails: userSettings.discreetEmails,
      })
      .from(userSettings)
      .where(eq(userSettings.userId, session.user.id))
      .limit(1),
  ]);

  const exportMoments = moments.map((entry) => ({
    ...entry,
    imageUrl: parsed.data.includePhotos ? entry.imageUrl : null,
  }));
  const filename = `life-replay-${new Date().toISOString().slice(0, 10)}.${parsed.data.format}`;
  const headers = {
    "Content-Disposition": `attachment; filename="${filename}"`,
    "Cache-Control": "no-store",
  };

  if (parsed.data.format === "json") {
    return new Response(
      JSON.stringify(
        {
          profile: {
            name: session.user.name,
            email: session.user.email,
            imageUrl: parsed.data.includePhotos ? session.user.image ?? null : null,
            createdAt: session.user.createdAt,
          },
          settings: settings ?? null,
          moments: exportMoments,
        },
        null,
        2,
      ),
      { headers: { ...headers, "Content-Type": "application/json; charset=utf-8" } },
    );
  }

  const columns: Array<
    "title" | "description" | "category" | "occurredAt" | "occurredOn" | "timezone" | "imageUrl"
  > = [
    "title",
    "description",
    "category",
    "occurredAt",
    "occurredOn",
    "timezone",
  ];
  if (parsed.data.includePhotos) columns.push("imageUrl");
  const rows = exportMoments.map((entry) => {
    const values = {
      title: entry.title,
      description: entry.description,
      category: entry.category,
      occurredAt: entry.occurredAt.toISOString(),
      occurredOn: entry.occurredOn,
      timezone: entry.timezone,
      imageUrl: entry.imageUrl,
    };
    return columns.map((column) => csvCell(values[column])).join(",");
  });

  return new Response([columns.join(","), ...rows].join("\r\n"), {
    headers: { ...headers, "Content-Type": "text/csv; charset=utf-8" },
  });
}