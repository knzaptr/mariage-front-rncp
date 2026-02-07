/*
  Warnings:

  - You are about to drop the `faq_items` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `faq_items_translations` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "faq_items_translations" DROP CONSTRAINT "faq_items_translations_faq_item_id_fkey";

-- DropForeignKey
ALTER TABLE "faq_items_translations" DROP CONSTRAINT "faq_items_translations_language_code_fkey";

-- DropTable
DROP TABLE "faq_items";

-- DropTable
DROP TABLE "faq_items_translations";

-- CreateTable
CREATE TABLE "faq_translation" (
    "id" SERIAL NOT NULL,
    "faq_key" TEXT NOT NULL,
    "language_code" VARCHAR(2) NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,

    CONSTRAINT "faq_translation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "faq_translation_faq_key_language_code_key" ON "faq_translation"("faq_key", "language_code");

-- AddForeignKey
ALTER TABLE "faq_translation" ADD CONSTRAINT "faq_translation_language_code_fkey" FOREIGN KEY ("language_code") REFERENCES "languages"("code") ON DELETE RESTRICT ON UPDATE CASCADE;
