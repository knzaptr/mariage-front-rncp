/*
  Warnings:

  - Added the required column `title` to the `faq_items` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "faq_items" ADD COLUMN     "title" TEXT NOT NULL;
