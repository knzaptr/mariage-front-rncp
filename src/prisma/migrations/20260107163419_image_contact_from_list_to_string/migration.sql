-- AlterTable
ALTER TABLE "contacts" ALTER COLUMN "image_contact" DROP NOT NULL,
ALTER COLUMN "image_contact" SET DATA TYPE TEXT;
