import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getOwnedMoment } from "@/features/moments/browse-queries";
import { MomentEditForm } from "@/components/moments/moment-edit-form";
import { getSessionUserId } from "@/features/auth/session";
import { z } from "zod";

type EditMomentPageProps = {
  params: Promise<{ momentId: string }>;
};

export async function generateMetadata({
  params,
}: EditMomentPageProps): Promise<Metadata> {
  const { momentId } = await params;
  if (!z.uuid().safeParse(momentId).success) {
    return {
      title: "Edit moment",
      description: "Update a moment in your private Life Replay archive.",
    };
  }

  const userId = await getSessionUserId();
  if (!userId) {
    return {
      title: "Edit moment",
      description: "Update a moment in your private Life Replay archive.",
    };
  }

  const entry = await getOwnedMoment(userId, momentId);
  return {
    title: entry ? `Edit ${entry.title}` : "Edit moment",
    description: "Update a moment in your private Life Replay archive.",
  };
}

export default async function EditMomentPage({
  params,
}: EditMomentPageProps) {
  const userId = await getSessionUserId();
  if (!userId) redirect("/login");

  const { momentId } = await params;
  if (!z.uuid().safeParse(momentId).success) notFound();

  const entry = await getOwnedMoment(userId, momentId);
  if (!entry) notFound();

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-7 px-4 pb-28 pt-6 md:px-8 md:pb-16 md:pt-10">
      <nav aria-label="Edit moment navigation">
        <Link
          href={`/moments/${entry.id}`}
          className="inline-flex min-h-11 items-center rounded-lg px-3 text-sm font-semibold text-teal hover:bg-teal-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal"
        >
          Back to moment
        </Link>
      </nav>
      <header className="flex flex-col gap-2 border-l-2 border-teal pl-5 md:pl-8">
        <p className="text-xs font-bold uppercase tracking-widest text-amber-dark">Personal archive</p>
        <h1 className="text-[28px] font-bold leading-tight text-foreground md:text-[36px]">Edit moment</h1>
      </header>
      <MomentEditForm
        moment={{
          id: entry.id,
          title: entry.title,
          description: entry.description,
          category: entry.category,
          occurredAt: entry.occurredAt.toISOString(),
          timezone: entry.timezone,
          imageUrl: entry.imageUrl,
        }}
      />
    </div>
  );
}