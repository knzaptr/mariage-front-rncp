/*
  Warnings:

  - Added the required column `token` to the `admins` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "admins" ADD COLUMN     "token" TEXT NOT NULL;
