import type { Metadata } from "next";
import { OnThisDayContent } from "@/components/dashboard/on-this-day-content";

export const metadata: Metadata = { title: "On This Day" };

export default function OnThisDayPage() {
  return <OnThisDayContent />;
}