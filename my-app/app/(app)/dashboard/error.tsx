"use client";

import { RouteError } from "@/components/ui/route-error";

export default function DashboardError({ reset }: { reset: () => void }) {
  return <RouteError message="We couldn’t load your archive." reset={reset} />;
}