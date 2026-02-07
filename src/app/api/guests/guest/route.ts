/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { isAuthenticated } from "@/middlewares/isAuthenticated";

export async function POST(req: Request) {
  try {
    const admin = await isAuthenticated(req);
    if (admin instanceof NextResponse) return admin;
    const body = await req.json();
    const { groupId, lastName, firstName, allowsPlusOne } = body;

    if (!lastName || !firstName || !allowsPlusOne) {
      return NextResponse.json(
        {
          message: "Missing lastName, firstName, allowsPlusOne 😗",
        },
        { status: 400 }
      );
    }

    const guestExist = await prisma.guest.findFirst({
      where: { lastName, firstName },
    });

    if (guestExist) {
      return NextResponse.json(
        { message: "Already resgistered" },
        { status: 404 }
      );
    }
    const newGuest = await prisma.guest.create({
      data: {
        groupId,
        lastName,
        firstName,
        allowsPlusOne,
        createdAt: new Date(),
      },
    });

    return NextResponse.json(
      {
        id: newGuest.id,
        lastName: newGuest.lastName,
        firstName: newGuest.firstName,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
