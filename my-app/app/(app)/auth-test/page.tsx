
"use client";

import { authClient } from "@/app/lib/auth-client";

export default function AuthTestPage() {
  const { data: session, isPending, error } =
    authClient.useSession();

  if (isPending) {
    return <p>Checking session...</p>;
  }

  if (error) {
    return <p>Unable to load session.</p>;
  }

  return (
    <main className="p-8">
      <h1 className="text-xl font-semibold">
        Better Auth Session Test
      </h1>

      {session ? (
        <pre>{JSON.stringify(session, null, 2)}</pre>
      ) : (
        <p>You are not logged in.</p>
      )}
    </main>
  );
}
