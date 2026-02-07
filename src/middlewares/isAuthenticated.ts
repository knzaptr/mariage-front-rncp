import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function isAuthenticated(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];

  const admin = await prisma.admin.findUnique({
    where: { token },
  });

  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return admin; // retourne l’admin pour l’utiliser dans la route
}
