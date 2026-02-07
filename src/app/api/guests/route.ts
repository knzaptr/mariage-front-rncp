/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET() {
  try {
    const allGuests = await prisma.guest.findMany();

    if (!allGuests) {
      return NextResponse.json(
        { message: "Guests Not Found" },
        { status: 404 },
      );
    }

    return NextResponse.json(allGuests, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { firstName, lastName } = await req.json();

    if (!firstName || !lastName) {
      return NextResponse.json(
        { message: "Missing firstName or lastName" },
        { status: 400 },
      );
    }

    // 1️⃣ Trouver l’invité
    const guest = await prisma.guest.findFirst({
      where: {
        firstName: {
          equals: firstName,
          mode: "insensitive",
        },
        lastName: {
          equals: lastName,
          mode: "insensitive",
        },
      },
      include: {
        group: {
          include: {
            guests: true, // 2️⃣ récupérer tous les membres du groupe
          },
        },
      },
    });

    if (!guest || !guest.group) {
      return NextResponse.json(
        { message: "Guest or group not found" },
        { status: 404 },
      );
    }

    // 3️⃣ Retourner uniquement le groupe
    return NextResponse.json(guest.group, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { group, guests } = body;

    if (!group || !guests || !Array.isArray(guests)) {
      return NextResponse.json({ error: "Données invalides" }, { status: 400 });
    }

    // Récupérer le groupe pour vérifier qu'il existe
    const existingGroup = await prisma.guestGroup.findFirst({
      where: { groupName: group },
      include: { guests: true },
    });

    if (!existingGroup) {
      return NextResponse.json({ error: "Groupe non trouvé" }, { status: 404 });
    }

    const now = new Date();

    // Traiter chaque invité
    const updatePromises = guests.map(async (guest) => {
      // Si l'invité a un ID numérique élevé (ID temporaire), c'est un nouveau plus-one
      const isNewPlusOne = guest.id > 1000000000000;

      if (isNewPlusOne) {
        // Créer un nouveau plus-one
        return prisma.guest.create({
          data: {
            groupId: existingGroup.id,
            firstName: guest.firstName,
            lastName: guest.lastName,
            hasResponded: true,
            attending: guest.attending,
            mealChoice: guest.mealChoice,
            allergies: guest.allergies,
            allowsPlusOne: false,
            plusOneOf: guest.plusOneOf,
            rsvpSubmittedAt: now,
          },
        });
      } else {
        // Mettre à jour un invité existant
        return prisma.guest.update({
          where: { id: guest.id },
          data: {
            hasResponded: true,
            attending: guest.attending,
            mealChoice: guest.mealChoice,
            allergies: guest.allergies,
            allowsPlusOne: guest.allowsPlusOne,
            rsvpSubmittedAt: now,
          },
        });
      }
    });

    // Exécuter toutes les opérations
    const updatedGuests = await Promise.all(updatePromises);

    // Récupérer le groupe complet mis à jour
    const updatedGroup = await prisma.guestGroup.findUnique({
      where: { id: existingGroup.id },
      include: { guests: true },
    });

    // console.log(updatedGuests);

    return NextResponse.json(
      {
        message: "RSVP enregistré avec succès",
        group: updatedGroup,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Erreur lors de l'enregistrement du RSVP:", error);
    return NextResponse.json(
      { error: "Erreur serveur lors de l'enregistrement" },
      { status: 500 },
    );
  }
}
