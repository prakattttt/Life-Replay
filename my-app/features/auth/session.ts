import { headers } from "next/headers";
import { auth } from "@/app/lib/auth";

export async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}

/**
 * The signed-in user's id, or null when there is no session.
 * The id must come from the session, never from the request. 
 */
export async function getSessionUserId(): Promise<string | null> {
  const session = await getSession();
  return session?.user.id ?? null;
}
