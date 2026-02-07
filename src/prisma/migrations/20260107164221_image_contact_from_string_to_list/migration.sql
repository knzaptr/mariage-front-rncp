/*
  Warnings:

  - The `image_contact` column on the `contacts` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "contacts" DROP COLUMN "image_contact",
ADD COLUMN     "image_contact" TEXT[];
