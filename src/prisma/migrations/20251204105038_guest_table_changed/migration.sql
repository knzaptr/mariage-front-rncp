/*
  Warnings:

  - You are about to drop the column `allows_plus_one` on the `guest_groups` table. All the data in the column will be lost.
  - You are about to drop the column `attending` on the `guest_groups` table. All the data in the column will be lost.
  - You are about to drop the column `group_type` on the `guest_groups` table. All the data in the column will be lost.
  - You are about to drop the column `has_responded` on the `guest_groups` table. All the data in the column will be lost.
  - You are about to drop the column `invitation_code` on the `guest_groups` table. All the data in the column will be lost.
  - You are about to drop the column `max_guests` on the `guest_groups` table. All the data in the column will be lost.
  - You are about to drop the column `preferred_language` on the `guest_groups` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `guests` table. All the data in the column will be lost.
  - You are about to drop the column `guest_type` on the `guests` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `guests` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "guest_groups_invitation_code_key";

-- AlterTable
ALTER TABLE "guest_groups" DROP COLUMN "allows_plus_one",
DROP COLUMN "attending",
DROP COLUMN "group_type",
DROP COLUMN "has_responded",
DROP COLUMN "invitation_code",
DROP COLUMN "max_guests",
DROP COLUMN "preferred_language";

-- AlterTable
ALTER TABLE "guests" DROP COLUMN "email",
DROP COLUMN "guest_type",
DROP COLUMN "phone",
ADD COLUMN     "allows_plus_one" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "meal_choice" TEXT,
ADD COLUMN     "plus_one_of" TEXT,
ADD COLUMN     "preferred_language" VARCHAR(2) NOT NULL DEFAULT 'fr',
ALTER COLUMN "group_id" DROP NOT NULL;

-- DropEnum
DROP TYPE "GroupType";

-- DropEnum
DROP TYPE "GuestType";
