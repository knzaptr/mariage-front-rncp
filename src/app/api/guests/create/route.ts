// app/api/groups/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { jsonValidationError } from "@/lib/api/zod-response";
import { guestGroupCreateBodySchema } from "@/schemas/api";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = guestGroupCreateBodySchema.safeParse(body);
    if (!parsed.success) {
      return jsonValidationError(parsed.error);
    }
    let { group, guests } = parsed.data;

    // Vérifier si le groupe existe déjà
    const existingGroup = await prisma.guestGroup.findUnique({
      where: { groupName: group },
    });

    if (existingGroup) {
      group = `${group}_${Date.now()}`; // Ajouter un suffixe unique pour éviter les conflits
    }

    // Créer le groupe avec ses invités en une seule transaction
    const newGroup = await prisma.guestGroup.create({
      data: {
        groupName: group,
        guests: {
          create: guests.map((guest) => ({
            firstName: guest.firstName,
            lastName: guest.lastName,
            allowsPlusOne: guest.allowsPlusOne,
            mealChoice: guest.mealChoice || null,
            allergies: guest.allergies || null,
          })),
        },
      },
      include: {
        guests: true,
      },
    });

    return NextResponse.json(
      {
        message: "Groupe créé avec succès",
        data: newGroup,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Erreur lors de la création du groupe:", error);
    return NextResponse.json(
      { error: "Erreur serveur lors de la création du groupe" },
      { status: 500 },
    );
  }
}
