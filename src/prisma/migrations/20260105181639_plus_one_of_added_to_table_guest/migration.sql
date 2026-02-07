/*
  Warnings:

  - You are about to drop the column `email` on the `guests` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "guests_email_idx";

-- AlterTable
ALTER TABLE "guests" DROP COLUMN "email",
ADD COLUMN     "plus_one_of" TEXT;
