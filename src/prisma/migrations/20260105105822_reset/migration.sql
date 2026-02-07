/*
  Warnings:

  - You are about to drop the `page_home` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `page_home_translations` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "page_home_translations" DROP CONSTRAINT "page_home_translations_language_code_fkey";

-- DropForeignKey
ALTER TABLE "page_home_translations" DROP CONSTRAINT "page_home_translations_page_home_id_fkey";

-- DropTable
DROP TABLE "page_home";

-- DropTable
DROP TABLE "page_home_translations";

-- CreateTable
CREATE TABLE "pages" (
    "id" SERIAL NOT NULL,
    "bride_name" TEXT NOT NULL,
    "groom_name" TEXT NOT NULL,
    "wedding_date" DATE NOT NULL,
    "rsvp_deadline" DATE NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pages_translations" (
    "id" SERIAL NOT NULL,
    "page_id" INTEGER NOT NULL,
    "language_code" VARCHAR(2) NOT NULL,
    "wedding_location" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pages_translations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "pages_translations_page_id_language_code_key" ON "pages_translations"("page_id", "language_code");

-- AddForeignKey
ALTER TABLE "pages_translations" ADD CONSTRAINT "pages_translations_page_id_fkey" FOREIGN KEY ("page_id") REFERENCES "pages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pages_translations" ADD CONSTRAINT "pages_translations_language_code_fkey" FOREIGN KEY ("language_code") REFERENCES "languages"("code") ON DELETE RESTRICT ON UPDATE CASCADE;
