import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/db";
import { jsonValidationError } from "@/lib/api/zod-response";
import { isAuthenticated } from "@/middlewares/isAuthenticated";
import {
  contactPostFieldsSchema,
  contactPutArraySchema,
} from "@/schemas/api";

import cloudinary from "@/lib/cloudinary";
import convertToBase64 from "@/utils/convertToBase64";

// app/api/contact/route.ts
import { getContacts } from "@/queries/contact";

export async function GET() {
  const contacts = await getContacts();
  return NextResponse.json(contacts);
}
// POST /api/contacts
export async function POST(request: NextRequest) {
  const admin = await isAuthenticated(request);
  if (admin instanceof NextResponse) return admin;

  const formData = await request.formData();
  const image = formData.get("image") as File | null;
  let imageUrl: string | null = null;

  // Upload de l'image si présente
  if (image) {
    const base64 = await convertToBase64(image);
    const uploadResult = await cloudinary.uploader.upload(base64, {
      folder: "wedding",
    });
    imageUrl = uploadResult.secure_url;
  }

  const translationsRaw = formData.get("translations");
  if (typeof translationsRaw !== "string") {
    return NextResponse.json(
      { error: "Champ translations manquant ou invalide" },
      { status: 400 },
    );
  }
  let translationsJson: unknown;
  try {
    translationsJson = JSON.parse(translationsRaw);
  } catch {
    return NextResponse.json(
      { error: "translations n'est pas un JSON valide" },
      { status: 400 },
    );
  }

  const parsed = contactPostFieldsSchema.safeParse({
    name: formData.get("name"),
    phoneNumber: formData.get("phoneNumber"),
    displayOrder: formData.get("displayOrder"),
    translations: translationsJson,
  });
  if (!parsed.success) {
    return jsonValidationError(parsed.error);
  }
  const { name, phoneNumber, displayOrder, translations } = parsed.data;

  // Créer le contact
  const newContact = await prisma.contact.create({
    data: {
      name,
      phoneNumber,
      displayOrder,
      imageContact: imageUrl ? [imageUrl] : [],
      translations: {
        create: translations.map((t) => ({
          language: t.language,
          relationship: t.relationship || "",
          role: t.role || "",
        })),
      },
    },
    include: {
      translations: true,
    },
  });

  revalidatePath("/");
  revalidatePath("/programme");
  revalidatePath("/faq");
  revalidatePath("/contact");
  return NextResponse.json(newContact, { status: 201 });
}

export async function PUT(req: NextRequest) {
  try {
    const admin = await isAuthenticated(req);
    if (admin instanceof NextResponse) return admin;

    const formData = await req.formData();
    const contactsRaw = formData.get("contacts") as string;

    if (!contactsRaw) {
      return NextResponse.json({ error: "Missing contacts" }, { status: 400 });
    }

    let contactsJson: unknown;
    try {
      contactsJson = JSON.parse(contactsRaw);
    } catch {
      return NextResponse.json(
        { error: "contacts n'est pas un JSON valide" },
        { status: 400 },
      );
    }

    const parsed = contactPutArraySchema.safeParse(contactsJson);
    if (!parsed.success) {
      return jsonValidationError(parsed.error);
    }
    const contacts = parsed.data;

    await Promise.all(
      contacts.map(async (contact) => {
        const imageFile = formData.get(`image-${contact.id}`) as File | null;

        let imageContact = contact.imageContact ?? [];

        // 🖼️ Nouvelle image envoyée
        if (imageFile) {
          const base64 = await convertToBase64(imageFile);

          const uploadResult = await cloudinary.uploader.upload(base64, {
            folder: "wedding",
          });

          imageContact = [uploadResult.secure_url];
        }

        return prisma.contact.update({
          where: { id: contact.id },
          data: {
            name: contact.name,
            phoneNumber: contact.phoneNumber,
            displayOrder: contact.displayOrder,
            imageContact,
            translations: {
              update: contact.translations.map((t) => ({
                where: { id: t.id },
                data: {
                  language: t.language,
                  role: t.role,
                  relationship: t.relationship,
                },
              })),
            },
          },
        });
      }),
    );

    const updatedContacts = await prisma.contact.findMany({
      orderBy: { displayOrder: "asc" },
      include: { translations: true },
    });

    revalidatePath("/");
    revalidatePath("/programme");
    revalidatePath("/faq");
    revalidatePath("/contact");
    return NextResponse.json(updatedContacts);
  } catch (error) {
    console.error("❌ CONTACT PUT error:", error);
    return NextResponse.json(
      { error: "Failed to update contacts" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  const admin = await isAuthenticated(request);
  if (admin instanceof NextResponse) return admin;

  try {
    // Récupérer l'ID depuis l'URL ou le body
    const { searchParams } = new URL(request.url);
    const id = Number(searchParams.get("id"));

    if (!id) {
      return NextResponse.json(
        { error: "ID du contact requis" },
        { status: 400 },
      );
    }

    // Récupérer le contact pour obtenir l'URL de l'image
    const contact = await prisma.contact.findUnique({
      where: { id },
    });

    if (!contact) {
      return NextResponse.json(
        { error: "Contact non trouvé" },
        { status: 404 },
      );
    }

    // Supprimer l'image de Cloudinary si elle existe
    if (contact.imageContact && contact.imageContact.length > 0) {
      for (const imageUrl of contact.imageContact) {
        // Extraire le public_id de l'URL Cloudinary
        const publicId = imageUrl.split("/").slice(-2).join("/").split(".")[0];

        await cloudinary.uploader.destroy(publicId);
      }
    }

    // Supprimer le contact (les traductions seront supprimées en cascade)
    await prisma.contact.delete({
      where: { id },
    });

    revalidatePath("/");
    revalidatePath("/programme");
    revalidatePath("/faq");
    revalidatePath("/contact");
    return NextResponse.json(
      { message: "Contact supprimé avec succès" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Erreur lors de la suppression du contact:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression du contact" },
      { status: 500 },
    );
  }
}
