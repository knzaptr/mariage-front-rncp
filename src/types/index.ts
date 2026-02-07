// Types pour l'application de mariage
// Générés à partir du schéma Prisma

// ============================================================================
// TYPES DE BASE
// ============================================================================

export type Language = "fr" | "en";

export type MealChoice = "viande" | "poisson" | "végétarien" | "enfant";

// ============================================================================
// ADMIN
// ============================================================================

export type Admin = {
  id: number;
  email: string;
  hash: string;
  salt: string;
  token: string;
  createdAt: Date;
  updatedAt: Date;
};

export type AdminLoginCredentials = {
  email: string;
  password: string;
};

export type AdminCreateInput = {
  email: string;
  password: string;
};

// ============================================================================
// PAGE ACCUEIL - Wedding Info
// ============================================================================

export type WeddingInfo = {
  id: number;
  brideName: string;
  groomName: string;
  weddingDate: Date;
  rsvpDeadline: Date;
  updatedAt: Date;
  translations: WeddingInfoTranslation[];
};

export type WeddingInfoTranslation = {
  id: number;
  weddingInfoId: number;
  venueAddress: string;
  language: Language;
  description: string;
};

export type WeddingInfoWithTranslation = Omit<WeddingInfo, "translations"> & {
  description: string;
};

export type WeddingInfoUpdateInput = {
  brideName?: string;
  groomName?: string;
  weddingDate?: Date | string;
  rsvpDeadline?: Date | string;
  venueAddress?: string;
  descriptionFr?: string;
  descriptionEn?: string;
};

// ============================================================================
// PAGE PROGRAMME - Activities
// ============================================================================

export type Activity = {
  id: number;
  time: string;
  displayOrder: number;
  updatedAt: Date;
  translations: ActivityTranslation[];
};

export type ActivityTranslation = {
  id: number;
  activityId: number;
  language: Language;
  activityName: string;
};

export type ActivityWithTranslation = Omit<Activity, "translations"> & {
  activityName: string;
};

export type ActivityCreateInput = {
  time: string;
  venueAddress: string;
  displayOrder: number;
  nameFr: string;
  nameEn: string;
};

export type ActivityUpdateInput = {
  time?: string;
  venueAddress?: string;
  displayOrder?: number;
  nameFr?: string;
  nameEn?: string;
};

// ============================================================================
// PAGE RSVP - Guests
// ============================================================================

export type GuestGroup = {
  id: number;
  groupName: string;
  createdAt: Date;
  updatedAt: Date;
  guests: Guest[];
};

export type Guest = {
  id: number;
  groupId: number;
  firstName: string;
  lastName: string;
  hasResponded: boolean;
  attending: boolean;
  mealChoice: MealChoice;
  allergies: string;
  allowsPlusOne: boolean;
  plusOneOf: string | null;
  rsvpSubmittedAt: Date;
  createdAt: Date;
  updatedAt: Date;
  group?: GuestGroup;
};

export type GuestGroupWithGuests = GuestGroup & {
  guests: Guest[];
};

export type GuestCreateInput = {
  groupId: number;
  firstName: string;
  lastName: string;
  allowsPlusOne?: boolean;
};

export type GuestGroupCreate = {
  group: string;
  guests: {
    firstName: string;
    lastName: string;
    allowsPlusOne: boolean;
    mealChoice?: string;
    allergies?: string;
  }[];
};

export type GuestUpdateInput = Partial<Guest>;

export type GuestResponsesMap = Record<number, GuestUpdateInput>;

// RSVP Form types
export type RsvpFormGuest = {
  guestId: number;
  firstName: string;
  lastName: string;
  attending: boolean;
  mealChoice?: MealChoice;
  allergies?: string;
};

export type RsvpFormPlusOne = {
  firstName: string;
  lastName: string;
  attending: boolean;
  mealChoice?: MealChoice;
  allergies?: string;
};

export type RsvpFormData = {
  groupCode: string;
  guests: RsvpFormGuest[];
  plusOnes?: Record<number, RsvpFormPlusOne>; // key = guestId
};

export type RsvpSubmitInput = {
  guestId: number;
  attending: boolean;
  mealChoice?: MealChoice;
  allergies?: string;
  plusOneFirstName?: string;
  plusOneLastName?: string;
  plusOneAttending?: boolean;
  plusOneMealChoice?: MealChoice;
  plusOneAllergies?: string;
};

// ============================================================================
// PAGE CONTACT
// ============================================================================

export type Contact = {
  id: number;
  name: string;
  phoneNumber: string;
  displayOrder: number;
  imageContact?: string[];
  newImageFile?: File;
  updatedAt: Date;
  translations: ContactTranslation[];
};

export type ContactTranslation = {
  id: number;
  contactId: number;
  language: Language;
  role: string;
  relationship: string;
};

export type ContactWithTranslation = Omit<Contact, "translations"> & {
  role: string;
  relationship: string;
};

export type ContactCreate = {
  name?: string;
  phoneNumber?: string;
  displayOrder?: number;
  imageContact?: string[];
  translations?: Partial<ContactTranslation>[];
};

export type ContactCreateInput = {
  name: string;
  phoneNumber: string;
  displayOrder: number;
  imageContact?: string[];
  roleFr: string;
  roleEn: string;
  relationshipFr: string;
  relationshipEn: string;
};

export type ContactUpdateInput = {
  name?: string;
  phoneNumber?: string;
  displayOrder?: number;
  imageContact?: string[];
  roleFr?: string;
  roleEn?: string;
  relationshipFr?: string;
  relationshipEn?: string;
};

// ============================================================================
// PAGE FAQ
// ============================================================================

export type Faq = {
  id: number;
  language: Language;
  question: string;
  answer: string;
  displayOrder: number;
  updatedAt: Date;
};

export type FaqCreateInput = {
  language: Language;
  question: string;
  answer: string;
  displayOrder: number;
};

export type FaqUpdateInput = {
  question?: string;
  answer?: string;
  displayOrder?: number;
};
