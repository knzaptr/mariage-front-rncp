// lib/queries/weddingInfo.ts
import prisma from "@/lib/db";
import { WeddingInfo, Language } from "@/types";

export async function getWeddingInfo(): Promise<WeddingInfo | null> {
  const weddingInfo = await prisma.weddingInfo.findFirst({
    include: { translations: true },
  });

  if (!weddingInfo) return null;

  return {
    ...weddingInfo,
    venueLink: weddingInfo.venueLink ?? undefined,
    translations: weddingInfo.translations.map((t) => ({
      ...t,
      language: t.language as Language,
    })),
  };
}
