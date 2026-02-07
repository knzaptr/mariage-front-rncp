import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { lastName, firstName } = await req.json();

    if (!lastName || !firstName) {
      return NextResponse.json(
        { message: "Missing lastName or firstName 😗" },
        { status: 400 }
      );
    }

    const guestExist = await prisma.guest.findFirst({
      where: {
        lastName: {
          equals: lastName,
          mode: "insensitive",
        },
        firstName: {
          equals: firstName,
          mode: "insensitive",
        },
      },
      include: {
        group: true, // utile pour l'affichage
      },
    });

    if (!guestExist) {
      return NextResponse.json({ message: "Guest Not Found" }, { status: 404 });
    }

    return NextResponse.json(guestExist, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
