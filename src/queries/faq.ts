// lib/queries/faq.ts
import prisma from "@/lib/db";
import { Faq } from "@/types";

export async function getFaqs(): Promise<Faq[]> {
  const faqs = await prisma.faq.findMany({
    orderBy: { displayOrder: "asc" },
  });

  return faqs as unknown as Faq[];
}
