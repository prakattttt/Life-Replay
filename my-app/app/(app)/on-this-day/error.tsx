"use client";

import { RouteError } from "@/components/ui/route-error";

export default function OnThisDayError({ reset }: { reset: () => void }) {
  return <RouteError message="We couldn’t load your memories." reset={reset} />;
}