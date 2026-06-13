import { z } from "zod";

export const languageSchema = z.enum(["fr", "en"]);

// --- Admin ---
export const adminCredentialsSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
});

// --- FAQ ---
export const faqTranslationInputSchema = z.object({
  language: languageSchema,
  question: z.string().min(1),
  answer: z.string().min(1),
});

export const faqPostBodySchema = z.object({
  displayOrder: z.coerce.number().int(),
  translations: z.array(faqTranslationInputSchema).min(1),
});

export const faqPutBodySchema = z.object({
  faqs: z
    .array(
      z.object({
        id: z.number().int().positive(),
        language: languageSchema,
        question: z.string().min(1),
        answer: z.string().min(1),
        displayOrder: z.number().int(),
      }),
    )
    .min(1),
});

export const faqDeleteBodySchema = z.object({
  displayOrder: z.coerce.number().int(),
});

// --- Guests lookup ---
export const guestNameLookupSchema = z.object({
  firstName: z.string().trim().min(1),
  lastName: z.string().trim().min(1),
});

// --- Guest create (admin) ---
export const guestCreateBodySchema = z.object({
  groupId: z.number().int().positive(),
  firstName: z.string().trim().min(1),
  lastName: z.string().trim().min(1),
  allowsPlusOne: z.boolean(),
});

// --- Guest group create ---
export const guestInGroupCreateSchema = z.object({
  firstName: z.string().trim().min(1),
  lastName: z.string().trim().min(1),
  allowsPlusOne: z.boolean(),
  mealChoice: z.string().optional().nullable(),
  allergies: z.string().optional().nullable(),
});

export const guestGroupCreateBodySchema = z.object({
  group: z.string().trim().min(1),
  guests: z.array(guestInGroupCreateSchema).min(1),
});

// --- RSVP batch update ---
export const rsvpGuestUpdateSchema = z.object({
  id: z.number(),
  firstName: z.string().trim().min(1),
  lastName: z.string().trim().min(1),
  attending: z.boolean(),
  mealChoice: z.string().nullable().optional(),
  allergies: z.string().nullable().optional(),
  allowsPlusOne: z.boolean().optional(),
  plusOneOf: z.string().nullable().optional(),
});

export const rsvpPutBodySchema = z.object({
  group: z.string().trim().min(1),
  guests: z.array(rsvpGuestUpdateSchema).min(1),
});

// --- Programme ---
export const activityTranslationSchema = z.object({
  language: languageSchema,
  activityName: z.string().min(1),
});

export const programmePostBodySchema = z.object({
  time: z.string().min(1),
  displayOrder: z.number().int().optional(),
  translations: z.array(activityTranslationSchema).min(1),
});

export const activityPutItemSchema = z.object({
  id: z.number().int().positive(),
  time: z.string().min(1),
  displayOrder: z.number().int(),
  translations: z.array(
    z.object({
      id: z.number().int().positive(),
      activityId: z.number().int().positive(),
      language: languageSchema,
      activityName: z.string().min(1),
    }),
  ),
});

export const programmePutBodySchema = z.object({
  activities: z.array(activityPutItemSchema).min(1),
});

// --- Wedding info ---
export const weddingInfoTranslationSchema = z.object({
  language: languageSchema,
  description: z.string(),
  venueAddress: z.string(),
});

export const weddingInfoPutBodySchema = z
  .object({
    brideName: z.string().min(1).optional(),
    groomName: z.string().min(1).optional(),
    venueLink: z.string().nullable().optional(),
    weddingDate: z.union([z.string(), z.date()]).optional(),
    rsvpDeadline: z.union([z.string(), z.date()]).optional(),
    translations: z.array(weddingInfoTranslationSchema).optional(),
  })
  .refine(
    (d) =>
      d.brideName !== undefined ||
      d.groomName !== undefined ||
      d.venueLink !== undefined ||
      d.weddingDate !== undefined ||
      d.rsvpDeadline !== undefined ||
      d.translations !== undefined,
    { message: "Au moins un champ de mise à jour est requis" },
  );

// --- Contact (parsed JSON / form-derived) ---
export const contactTranslationSchema = z.object({
  id: z.number().int().positive().optional(),
  language: languageSchema,
  role: z.string(),
  relationship: z.string(),
  contactId: z.number().int().positive().optional(),
});

export const contactPostFieldsSchema = z.object({
  name: z.string().trim().min(1),
  phoneNumber: z.string().trim().min(1),
  displayOrder: z.coerce.number().int(),
  translations: z.array(contactTranslationSchema).min(1),
});

export const contactPutItemSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().trim().min(1),
  phoneNumber: z.string().trim().min(1),
  displayOrder: z.number().int(),
  imageContact: z.array(z.string()).optional(),
  translations: z
    .array(
      z.object({
        id: z.number().int().positive(),
        language: languageSchema,
        role: z.string(),
        relationship: z.string(),
        contactId: z.number().int().positive().optional(),
      }),
    )
    .min(1),
});

/** Le champ formData `contacts` est un JSON tableau d'objets contact. */
export const contactPutArraySchema = z.array(contactPutItemSchema).min(1);
