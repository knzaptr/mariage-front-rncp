/*
  Warnings:

  - You are about to drop the column `order` on the `contacts` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `contacts` table. All the data in the column will be lost.
  - You are about to drop the column `photo_url` on the `contacts` table. All the data in the column will be lost.
  - You are about to drop the column `dietary_restrictions` on the `guests` table. All the data in the column will be lost.
  - You are about to drop the column `plus_one_of` on the `guests` table. All the data in the column will be lost.
  - You are about to drop the column `preferred_language` on the `guests` table. All the data in the column will be lost.
  - You are about to drop the `admin` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `contacts_translations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `faq_translation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `languages` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `pages` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `pages_translations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `programme_activities` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `programme_activities_translations` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[code]` on the table `guest_groups` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `display_order` to the `contacts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone_number` to the `contacts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `code` to the `guest_groups` table without a default value. This is not possible if the table is not empty.
  - Made the column `group_id` on table `guests` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "contacts_translations" DROP CONSTRAINT "contacts_translations_contact_id_fkey";

-- DropForeignKey
ALTER TABLE "contacts_translations" DROP CONSTRAINT "contacts_translations_language_code_fkey";

-- DropForeignKey
ALTER TABLE "faq_translation" DROP CONSTRAINT "faq_translation_language_code_fkey";

-- DropForeignKey
ALTER TABLE "pages_translations" DROP CONSTRAINT "pages_translations_language_code_fkey";

-- DropForeignKey
ALTER TABLE "pages_translations" DROP CONSTRAINT "pages_translations_page_id_fkey";

-- DropForeignKey
ALTER TABLE "programme_activities_translations" DROP CONSTRAINT "programme_activities_translations_activity_id_fkey";

-- DropForeignKey
ALTER TABLE "programme_activities_translations" DROP CONSTRAINT "programme_activities_translations_language_code_fkey";

-- AlterTable
ALTER TABLE "contacts" DROP COLUMN "order",
DROP COLUMN "phone",
DROP COLUMN "photo_url",
ADD COLUMN     "display_order" INTEGER NOT NULL,
ADD COLUMN     "phone_number" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "guest_groups" ADD COLUMN     "code" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "guests" DROP COLUMN "dietary_restrictions",
DROP COLUMN "plus_one_of",
DROP COLUMN "preferred_language",
ADD COLUMN     "allergies" TEXT,
ADD COLUMN     "email" TEXT,
ADD COLUMN     "has_responded" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "plus_one_allergies" TEXT,
ADD COLUMN     "plus_one_attending" BOOLEAN,
ADD COLUMN     "plus_one_first_name" TEXT,
ADD COLUMN     "plus_one_last_name" TEXT,
ADD COLUMN     "plus_one_meal_choice" TEXT,
ADD COLUMN     "rsvp_submitted_at" TIMESTAMP(3),
ALTER COLUMN "group_id" SET NOT NULL;

-- DropTable
DROP TABLE "admin";

-- DropTable
DROP TABLE "contacts_translations";

-- DropTable
DROP TABLE "faq_translation";

-- DropTable
DROP TABLE "languages";

-- DropTable
DROP TABLE "pages";

-- DropTable
DROP TABLE "pages_translations";

-- DropTable
DROP TABLE "programme_activities";

-- DropTable
DROP TABLE "programme_activities_translations";

-- CreateTable
CREATE TABLE "admins" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "salt" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wedding_info" (
    "id" SERIAL NOT NULL,
    "bride_name" TEXT NOT NULL,
    "groom_name" TEXT NOT NULL,
    "wedding_date" DATE NOT NULL,
    "rsvp_deadline" DATE NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "wedding_info_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wedding_info_translations" (
    "id" SERIAL NOT NULL,
    "wedding_info_id" INTEGER NOT NULL,
    "language" VARCHAR(2) NOT NULL,
    "description" TEXT NOT NULL,
    "venue_address" TEXT NOT NULL,

    CONSTRAINT "wedding_info_translations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activities" (
    "id" SERIAL NOT NULL,
    "time" TEXT NOT NULL,
    "display_order" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "activities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activity_translations" (
    "id" SERIAL NOT NULL,
    "activity_id" INTEGER NOT NULL,
    "language" VARCHAR(2) NOT NULL,
    "activity_name" TEXT NOT NULL,

    CONSTRAINT "activity_translations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contact_translations" (
    "id" SERIAL NOT NULL,
    "contact_id" INTEGER NOT NULL,
    "language" VARCHAR(2) NOT NULL,
    "role" TEXT NOT NULL,
    "relationship" TEXT NOT NULL,

    CONSTRAINT "contact_translations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "faqs" (
    "id" SERIAL NOT NULL,
    "language" VARCHAR(2) NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "display_order" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "faqs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admins_email_key" ON "admins"("email");

-- CreateIndex
CREATE UNIQUE INDEX "wedding_info_translations_wedding_info_id_key" ON "wedding_info_translations"("wedding_info_id");

-- CreateIndex
CREATE UNIQUE INDEX "wedding_info_translations_wedding_info_id_language_key" ON "wedding_info_translations"("wedding_info_id", "language");

-- CreateIndex
CREATE UNIQUE INDEX "activity_translations_activity_id_language_key" ON "activity_translations"("activity_id", "language");

-- CreateIndex
CREATE UNIQUE INDEX "contact_translations_contact_id_language_key" ON "contact_translations"("contact_id", "language");

-- CreateIndex
CREATE INDEX "faqs_language_idx" ON "faqs"("language");

-- CreateIndex
CREATE UNIQUE INDEX "guest_groups_code_key" ON "guest_groups"("code");

-- CreateIndex
CREATE INDEX "guests_group_id_idx" ON "guests"("group_id");

-- CreateIndex
CREATE INDEX "guests_email_idx" ON "guests"("email");

-- AddForeignKey
ALTER TABLE "wedding_info_translations" ADD CONSTRAINT "wedding_info_translations_wedding_info_id_fkey" FOREIGN KEY ("wedding_info_id") REFERENCES "wedding_info"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_translations" ADD CONSTRAINT "activity_translations_activity_id_fkey" FOREIGN KEY ("activity_id") REFERENCES "activities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contact_translations" ADD CONSTRAINT "contact_translations_contact_id_fkey" FOREIGN KEY ("contact_id") REFERENCES "contacts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
