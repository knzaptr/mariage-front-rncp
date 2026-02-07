/*
  Warnings:

  - You are about to drop the column `plus_one_allergies` on the `guests` table. All the data in the column will be lost.
  - You are about to drop the column `plus_one_attending` on the `guests` table. All the data in the column will be lost.
  - You are about to drop the column `plus_one_first_name` on the `guests` table. All the data in the column will be lost.
  - You are about to drop the column `plus_one_last_name` on the `guests` table. All the data in the column will be lost.
  - You are about to drop the column `plus_one_meal_choice` on the `guests` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "guests" DROP COLUMN "plus_one_allergies",
DROP COLUMN "plus_one_attending",
DROP COLUMN "plus_one_first_name",
DROP COLUMN "plus_one_last_name",
DROP COLUMN "plus_one_meal_choice";
