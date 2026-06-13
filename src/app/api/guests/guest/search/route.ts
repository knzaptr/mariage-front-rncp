import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { jsonValidationError } from "@/lib/api/zod-response";
import { guestNameLookupSchema } from "@/schemas/api";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = guestNameLookupSchema.safeParse(body);
    if (!parsed.success) {
      return jsonValidationError(parsed.error);
    }
    const { lastName, firstName } = parsed.data;

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
