import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { jsonValidationError } from "@/lib/api/zod-response";
import { isAuthenticated } from "@/middlewares/isAuthenticated";
import { getActivities } from "@/queries/programme";
import {
  programmePostBodySchema,
  programmePutBodySchema,
} from "@/schemas/api";
import { revalidatePath } from "next/cache";
/**
 * GET /api/activities
 */
export async function GET() {
  const activities = await getActivities();

  return NextResponse.json(activities);
}

export async function POST(request: NextRequest) {
  const admin = await isAuthenticated(request);
  if (admin instanceof NextResponse) return admin;

  const body = await request.json();
  const parsed = programmePostBodySchema.safeParse(body);
  if (!parsed.success) {
    return jsonValidationError(parsed.error);
  }
  const { time, displayOrder, translations } = parsed.data;

  // Créer l'activité avec ses traductions
  const newActivity = await prisma.activity.create({
    data: {
      time,
      displayOrder: displayOrder ?? 1,
      translations: {
        create: translations.map((t) => ({
          language: t.language,
          activityName: t.activityName,
        })),
      },
    },
    include: {
      translations: true,
    },
  });

  revalidatePath("/programme");
  return NextResponse.json(newActivity, { status: 201 });
}

export async function PUT(request: NextRequest) {
  const admin = await isAuthenticated(request);

  if (admin instanceof NextResponse) return admin;
  const body = await request.json();
  const parsed = programmePutBodySchema.safeParse(body);
  if (!parsed.success) {
    return jsonValidationError(parsed.error);
  }
  const { activities } = parsed.data;

  // 🔐 Transaction pour tout mettre à jour proprement
  const updatedActivities = await prisma.$transaction(
    activities.map((activity) =>
      prisma.activity.update({
        where: { id: activity.id },
        data: {
          time: activity.time,
          displayOrder: activity.displayOrder,
          translations: {
            upsert: activity.translations.map((t) => ({
              where: {
                activityId_language: {
                  activityId: activity.id,
                  language: t.language,
                },
              },
              update: {
                activityName: t.activityName,
              },
              create: {
                language: t.language,
                activityName: t.activityName,
              },
            })),
          },
        },
        include: {
          translations: true,
        },
      }),
    ),
  );

  revalidatePath("/programme");
  return NextResponse.json(updatedActivities);
}

export async function DELETE(request: NextRequest) {
  const admin = await isAuthenticated(request);
  if (admin instanceof NextResponse) return admin;

  try {
    // Récupérer l'ID depuis l'URL
    const { searchParams } = new URL(request.url);
    const id = Number(searchParams.get("id"));

    if (!id) {
      return NextResponse.json(
        { error: "ID de l'activité requis" },
        { status: 400 },
      );
    }

    // Vérifier que l'activité existe
    const activity = await prisma.activity.findUnique({
      where: { id },
    });

    if (!activity) {
      return NextResponse.json(
        { error: "Activité non trouvée" },
        { status: 404 },
      );
    }

    // Supprimer l'activité (les traductions seront supprimées en cascade)
    await prisma.activity.delete({
      where: { id },
    });

    revalidatePath("/programme");
    return NextResponse.json(
      { message: "Activité supprimée avec succès" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Erreur lors de la suppression de l'activité:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression de l'activité" },
      { status: 500 },
    );
  }
}
