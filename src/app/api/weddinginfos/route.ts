import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { jsonValidationError } from "@/lib/api/zod-response";
import { isAuthenticated } from "@/middlewares/isAuthenticated";
import { getWeddingInfo } from "@/queries/weddinginfo";
import { weddingInfoPutBodySchema } from "@/schemas/api";
import { revalidatePath } from "next/cache";

export async function GET() {
  const weddingInfo = await getWeddingInfo();

  if (!weddingInfo) {
    return NextResponse.json(
      { error: "Wedding info not found" },
      { status: 404 },
    );
  }

  return NextResponse.json(weddingInfo);
}

export async function PUT(request: NextRequest) {
  const authResult = await isAuthenticated(request);
  if (authResult instanceof NextResponse) {
    // Si auth échoue, retourner la réponse d'erreur
    return authResult;
  }

  const body = await request.json();
  const parsed = weddingInfoPutBodySchema.safeParse(body);
  if (!parsed.success) {
    return jsonValidationError(parsed.error);
  }
  const {
    translations,
    brideName,
    groomName,
    venueLink,
    weddingDate,
    rsvpDeadline,
  } = parsed.data;

  // 1️⃣ Récupérer le WeddingInfo existant
  const weddingInfo = await prisma.weddingInfo.findFirst();

  if (!weddingInfo) {
    return NextResponse.json(
      { error: "Wedding info not found" },
      { status: 404 },
    );
  }

  // 2️⃣ Update WeddingInfo + upsert translations
  const updatedWeddingInfo = await prisma.weddingInfo.update({
    where: { id: weddingInfo.id },
    data: {
      brideName,
      groomName,
      venueLink,
      weddingDate: weddingDate ? new Date(weddingDate) : undefined,
      rsvpDeadline: rsvpDeadline ? new Date(rsvpDeadline) : undefined,
      translations: translations
        ? {
            upsert: translations.map((t) => ({
              where: {
                weddingInfoId_language: {
                  weddingInfoId: weddingInfo.id,
                  language: t.language,
                },
              },
              update: {
                description: t.description,
                venueAddress: t.venueAddress,
              },
              create: {
                language: t.language,
                description: t.description,
                venueAddress: t.venueAddress,
              },
            })),
          }
        : undefined,
    },
    include: {
      translations: true,
    },
  });

  revalidatePath("/");
  revalidatePath("/programme");
  revalidatePath("/faq");
  revalidatePath("/contact");
  return NextResponse.json(updatedWeddingInfo);
}
