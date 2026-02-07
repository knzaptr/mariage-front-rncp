/*
  Warnings:

  - A unique constraint covering the columns `[token]` on the table `admins` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "admins_token_key" ON "admins"("token");
