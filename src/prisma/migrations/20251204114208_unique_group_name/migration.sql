/*
  Warnings:

  - A unique constraint covering the columns `[group_name]` on the table `guest_groups` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "guest_groups_group_name_key" ON "guest_groups"("group_name");
