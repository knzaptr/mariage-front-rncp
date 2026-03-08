// lib/queries/programme.ts
import prisma from "@/lib/db";
import { Activity, Language } from "@/types";

export async function getActivities(): Promise<Activity[]> {
  const activities = await prisma.activity.findMany({
    orderBy: { time: "asc" },
    include: { translations: true },
  });

  return activities.map((activity) => ({
    ...activity,
    translations: activity.translations.map((t) => ({
      ...t,
      language: t.language as Language,
    })),
  }));
}
