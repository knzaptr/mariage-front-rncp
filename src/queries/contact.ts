// lib/queries/contact.ts
import prisma from "@/lib/db";
import { Contact, Language } from "@/types";

export async function getContacts(): Promise<Contact[]> {
  const contacts = await prisma.contact.findMany({
    orderBy: { displayOrder: "asc" },
    include: { translations: true },
  });

  return contacts.map((contact) => ({
    ...contact,
    translations: contact.translations.map((t) => ({
      ...t,
      language: t.language as Language,
    })),
  }));
}
