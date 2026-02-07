-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'GUEST');

-- CreateEnum
CREATE TYPE "GroupType" AS ENUM ('SINGLE', 'COUPLE', 'FAMILY');

-- CreateEnum
CREATE TYPE "GuestType" AS ENUM ('MAIN', 'PLUS_ONE', 'FAMILY_MEMBER');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'GUEST',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "languages" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(2) NOT NULL,
    "name" TEXT NOT NULL,
    "is_default" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "languages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "page_home" (
    "id" SERIAL NOT NULL,
    "bride_name" TEXT NOT NULL,
    "groom_name" TEXT NOT NULL,
    "wedding_date" DATE NOT NULL,
    "rsvp_deadline" DATE NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "page_home_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "page_home_translations" (
    "id" SERIAL NOT NULL,
    "page_home_id" INTEGER NOT NULL,
    "language_code" VARCHAR(2) NOT NULL,
    "wedding_location" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "page_home_translations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "programme_activities" (
    "id" SERIAL NOT NULL,
    "time" TIME NOT NULL,
    "wedding_date" DATE NOT NULL,
    "order" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "programme_activities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "programme_activities_translations" (
    "id" SERIAL NOT NULL,
    "activity_id" INTEGER NOT NULL,
    "language_code" VARCHAR(2) NOT NULL,
    "activity_name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "programme_activities_translations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guest_groups" (
    "id" SERIAL NOT NULL,
    "group_name" TEXT NOT NULL,
    "group_type" "GroupType" NOT NULL,
    "max_guests" INTEGER NOT NULL,
    "allows_plus_one" BOOLEAN NOT NULL DEFAULT false,
    "invitation_code" TEXT NOT NULL,
    "preferred_language" VARCHAR(2) NOT NULL DEFAULT 'fr',
    "has_responded" BOOLEAN NOT NULL DEFAULT false,
    "attending" BOOLEAN,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "guest_groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guests" (
    "id" SERIAL NOT NULL,
    "group_id" INTEGER NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "guest_type" "GuestType" NOT NULL,
    "dietary_restrictions" TEXT,
    "attending" BOOLEAN,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "guests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contacts" (
    "id" SERIAL NOT NULL,
    "photo_url" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contacts_translations" (
    "id" SERIAL NOT NULL,
    "contact_id" INTEGER NOT NULL,
    "language_code" VARCHAR(2) NOT NULL,
    "role" TEXT NOT NULL,
    "relationship" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contacts_translations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "faq_items" (
    "id" SERIAL NOT NULL,
    "photo_1_url" TEXT,
    "photo_2_url" TEXT,
    "order" INTEGER NOT NULL,
    "is_published" BOOLEAN NOT NULL DEFAULT true,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "faq_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "faq_items_translations" (
    "id" SERIAL NOT NULL,
    "faq_item_id" INTEGER NOT NULL,
    "language_code" VARCHAR(2) NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "faq_items_translations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "languages_code_key" ON "languages"("code");

-- CreateIndex
CREATE UNIQUE INDEX "page_home_translations_page_home_id_language_code_key" ON "page_home_translations"("page_home_id", "language_code");

-- CreateIndex
CREATE UNIQUE INDEX "programme_activities_translations_activity_id_language_code_key" ON "programme_activities_translations"("activity_id", "language_code");

-- CreateIndex
CREATE UNIQUE INDEX "guest_groups_invitation_code_key" ON "guest_groups"("invitation_code");

-- CreateIndex
CREATE UNIQUE INDEX "contacts_translations_contact_id_language_code_key" ON "contacts_translations"("contact_id", "language_code");

-- CreateIndex
CREATE UNIQUE INDEX "faq_items_translations_faq_item_id_language_code_key" ON "faq_items_translations"("faq_item_id", "language_code");

-- AddForeignKey
ALTER TABLE "page_home_translations" ADD CONSTRAINT "page_home_translations_page_home_id_fkey" FOREIGN KEY ("page_home_id") REFERENCES "page_home"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "page_home_translations" ADD CONSTRAINT "page_home_translations_language_code_fkey" FOREIGN KEY ("language_code") REFERENCES "languages"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "programme_activities_translations" ADD CONSTRAINT "programme_activities_translations_activity_id_fkey" FOREIGN KEY ("activity_id") REFERENCES "programme_activities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "programme_activities_translations" ADD CONSTRAINT "programme_activities_translations_language_code_fkey" FOREIGN KEY ("language_code") REFERENCES "languages"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guests" ADD CONSTRAINT "guests_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "guest_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contacts_translations" ADD CONSTRAINT "contacts_translations_contact_id_fkey" FOREIGN KEY ("contact_id") REFERENCES "contacts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contacts_translations" ADD CONSTRAINT "contacts_translations_language_code_fkey" FOREIGN KEY ("language_code") REFERENCES "languages"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "faq_items_translations" ADD CONSTRAINT "faq_items_translations_faq_item_id_fkey" FOREIGN KEY ("faq_item_id") REFERENCES "faq_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "faq_items_translations" ADD CONSTRAINT "faq_items_translations_language_code_fkey" FOREIGN KEY ("language_code") REFERENCES "languages"("code") ON DELETE RESTRICT ON UPDATE CASCADE;
