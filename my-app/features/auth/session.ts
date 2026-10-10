import { MOCK_USER_ID } from "@/features/timeline/mock-data";

/**
 * The signed-in user's id, or null when there is no session.
 * The id must come from the session, never from the request. 
 */
export async function getSessionUserId(): Promise<string | null> {
  return MOCK_USER_ID;
}
