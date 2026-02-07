/*
  Warnings:

  - You are about to drop the column `code` on the `guest_groups` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "guest_groups_code_key";

-- AlterTable
ALTER TABLE "guest_groups" DROP COLUMN "code";
