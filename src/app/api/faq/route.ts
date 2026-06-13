import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { jsonValidationError } from "@/lib/api/zod-response";
import { isAuthenticated } from "@/middlewares/isAuthenticated";
import { getFaqs } from "@/queries/faq";
import {
  faqDeleteBodySchema,
  faqPostBodySchema,
  faqPutBodySchema,
} from "@/schemas/api";
import { revalidatePath } from "next/cache";

/**
 * GET /api/faq?lang=fr
 */
export async function GET() {
  const faqs = await getFaqs();

  return NextResponse.json(faqs);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = faqPostBodySchema.safeParse(body);
    if (!parsed.success) {
      return jsonValidationError(parsed.error);
    }
    const { displayOrder, translations } = parsed.data;

    await prisma.faq.createMany({
      data: translations.map((t) => ({
        displayOrder,
        language: t.language,
        question: t.question,
        answer: t.answer,
      })),
    });

    // On renvoie le groupe créé
    const createdFaqs = await prisma.faq.findMany({
      where: { displayOrder },
      orderBy: { language: "asc" },
    });

    revalidatePath("/");
    revalidatePath("/programme");
    revalidatePath("/faq");
    revalidatePath("/contact");
    return NextResponse.json(createdFaqs, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erreur lors de la création de la FAQ" },
      { status: 500 },
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const admin = await isAuthenticated(req);
    if (admin instanceof NextResponse) return admin;
    const body = await req.json();
    const parsed = faqPutBodySchema.safeParse(body);
    if (!parsed.success) {
      return jsonValidationError(parsed.error);
    }
    const { faqs } = parsed.data;

    // 🔁 Mise à jour en boucle
    await Promise.all(
      faqs.map((faq) =>
        prisma.faq.update({
          where: { id: faq.id },
          data: {
            language: faq.language,
            question: faq.question,
            answer: faq.answer,
            displayOrder: faq.displayOrder,
          },
        }),
      ),
    );

    // 🔄 Retourner la FAQ mise à jour
    const updatedFaqs = await prisma.faq.findMany({
      orderBy: { displayOrder: "asc" },
    });

    revalidatePath("/");
    revalidatePath("/programme");
    revalidatePath("/faq");
    revalidatePath("/contact");
    return NextResponse.json(updatedFaqs);
  } catch (error) {
    console.error("❌ FAQ PUT error:", error);
    return NextResponse.json(
      { error: "Failed to update FAQ" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const parsed = faqDeleteBodySchema.safeParse(body);
    if (!parsed.success) {
      return jsonValidationError(parsed.error);
    }
    const { displayOrder } = parsed.data;

    await prisma.faq.deleteMany({
      where: {
        displayOrder,
      },
    });

    revalidatePath("/");
    revalidatePath("/programme");
    revalidatePath("/faq");
    revalidatePath("/contact");
    return NextResponse.json(
      { message: "FAQs FR/EN supprimées avec succès" },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression des FAQs" },
      { status: 500 },
    );
  }
}
