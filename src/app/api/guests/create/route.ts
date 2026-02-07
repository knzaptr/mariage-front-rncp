// app/api/groups/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { GuestGroupCreate } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const body: GuestGroupCreate = await request.json();

    // Validation basique
    if (!body.group || !body.guests || body.guests.length === 0) {
      return NextResponse.json(
        { error: "Le nom du groupe et au moins un invité sont requis" },
        { status: 400 }
      );
    }

    // Vérifier si le groupe existe déjà
    const existingGroup = await prisma.guestGroup.findUnique({
      where: { groupName: body.group },
    });

    if (existingGroup) {
      return NextResponse.json(
        { error: "Un groupe avec ce nom existe déjà" },
        { status: 409 }
      );
    }

    // Créer le groupe avec ses invités en une seule transaction
    const newGroup = await prisma.guestGroup.create({
      data: {
        groupName: body.group,
        guests: {
          create: body.guests.map((guest) => ({
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
      { status: 201 }
    );
  } catch (error) {
    console.error("Erreur lors de la création du groupe:", error);
    return NextResponse.json(
      { error: "Erreur serveur lors de la création du groupe" },
      { status: 500 }
    );
  }
}
