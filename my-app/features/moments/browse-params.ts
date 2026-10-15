import { z } from "zod";
import { MOMENT_CATEGORIES, type MomentCategory } from "@/types/moment";

export const MOMENT_BROWSE_PAGE_SIZE = 12;

export type RawMomentBrowseParams = Record<string, string | string[] | undefined>;

export type MomentBrowseQuery = {
  query: string;
  category: MomentCategory | null;
  page: number;
};

const browseParamsSchema = z.object({
  q: z.string().trim().max(120).optional().catch(undefined),
  category: z.enum(MOMENT_CATEGORIES).optional().catch(undefined),
  page: z.coerce.number().int().min(1).max(500).catch(1),
});

const firstValue = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

export function parseMomentBrowseParams(raw: RawMomentBrowseParams): MomentBrowseQuery {
  const parsed = browseParamsSchema.parse({
    q: firstValue(raw.q),
    category: firstValue(raw.category),
    page: firstValue(raw.page),
  });

  return {
    query: parsed.q ?? "",
    category: parsed.category ?? null,
    page: parsed.page,
  };
}