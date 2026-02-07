import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { isAuthenticated } from "@/middlewares/isAuthenticated";

/**
 * GET /api/faq?lang=fr
 */
export async function GET() {
  const faqs = await prisma.faq.findMany({
    orderBy: { displayOrder: "asc" },
  });

  return NextResponse.json(faqs);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { displayOrder, translations } = body;

    if (!displayOrder || !translations || !Array.isArray(translations)) {
      return NextResponse.json(
        { error: "displayOrder et translations requis" },
        { status: 400 },
      );
    }

    // Sécurité minimale
    for (const t of translations) {
      if (!t.language || !t.question || !t.answer) {
        return NextResponse.json(
          {
            error: "Chaque traduction doit avoir language, question et answer",
          },
          { status: 400 },
        );
      }
    }

    await prisma.faq.createMany({
      data: translations.map((t) => ({
        displayOrder: Number(displayOrder),
        language: t.language,
        question: t.question,
        answer: t.answer,
      })),
    });

    // On renvoie le groupe créé
    const createdFaqs = await prisma.faq.findMany({
      where: { displayOrder: Number(displayOrder) },
      orderBy: { language: "asc" },
    });

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
    const { faqs } = await req.json();

    if (!Array.isArray(faqs)) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

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
    const { displayOrder } = await req.json();

    if (!displayOrder) {
      return NextResponse.json(
        { error: "displayOrder requis" },
        { status: 400 },
      );
    }

    await prisma.faq.deleteMany({
      where: {
        displayOrder: Number(displayOrder),
      },
    });

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
