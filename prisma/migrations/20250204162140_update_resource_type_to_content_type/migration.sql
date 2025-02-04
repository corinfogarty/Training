/*
  Warnings:

  - You are about to drop the column `type` on the `Resource` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ContentType" AS ENUM ('Resource', 'Training', 'Shortcut');

-- AlterTable
ALTER TABLE "Resource" DROP COLUMN "type",
ADD COLUMN     "contentType" "ContentType" NOT NULL DEFAULT 'Training';

-- DropEnum
DROP TYPE "ResourceType";
