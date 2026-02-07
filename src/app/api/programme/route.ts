import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { Activity, ActivityTranslation } from "@/types";
import { isAuthenticated } from "@/middlewares/isAuthenticated";

/**
 * GET /api/activities
 */
export async function GET() {
  const activities = await prisma.activity.findMany({
    orderBy: { time: "asc" },
    include: {
      translations: true,
    },
  });

  return NextResponse.json(activities);
}

export async function POST(request: NextRequest) {
  const admin = await isAuthenticated(request);
  if (admin instanceof NextResponse) return admin;

  const body = await request.json();

  // Créer l'activité avec ses traductions
  const newActivity = await prisma.activity.create({
    data: {
      time: body.time,
      displayOrder: body.displayOrder || 1,
      translations: {
        create: body.translations.map((t: ActivityTranslation) => ({
          language: t.language,
          activityName: t.activityName,
        })),
      },
    },
    include: {
      translations: true,
    },
  });

  return NextResponse.json(newActivity, { status: 201 });
}

export async function PUT(request: NextRequest) {
  const admin = await isAuthenticated(request);

  if (admin instanceof NextResponse) return admin;
  const body = await request.json();
  const { activities } = body;

  if (!Array.isArray(activities)) {
    return NextResponse.json(
      { error: "Invalid activities payload" },
      { status: 400 },
    );
  }

  // 🔐 Transaction pour tout mettre à jour proprement
  const updatedActivities = await prisma.$transaction(
    activities.map((activity: Activity) =>
      prisma.activity.update({
        where: { id: activity.id },
        data: {
          time: activity.time,
          displayOrder: activity.displayOrder,
          translations: {
            upsert: activity.translations.map((t: ActivityTranslation) => ({
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
