import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { isAuthenticated } from "@/middlewares/isAuthenticated";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function DELETE(req: NextRequest, context: RouteContext) {
  try {
    const admin = await isAuthenticated(req);
    if (admin instanceof NextResponse) return admin;

    const { id } = await context.params;
    const guestId = Number(id);

    if (isNaN(guestId)) {
      return NextResponse.json(
        { message: "Invalid guestId 😗" },
        { status: 400 },
      );
    }

    const guestToDelete = await prisma.guest.findUnique({
      where: { id: guestId },
    });

    if (!guestToDelete) {
      return NextResponse.json({ message: "Guest not found" }, { status: 404 });
    }

    await prisma.guest.delete({
      where: { id: guestId },
    });

    return NextResponse.json(
      { message: "Guest deleted successfully" },
      { status: 200 },
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
