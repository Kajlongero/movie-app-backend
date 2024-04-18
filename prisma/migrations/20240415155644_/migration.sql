/*
  Warnings:

  - You are about to drop the column `category_id` on the `Chat` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Chat" DROP CONSTRAINT "Chat_category_id_fkey";

-- DropIndex
DROP INDEX "Chat_category_id_key";

-- AlterTable
ALTER TABLE "Chat" DROP COLUMN "category_id";
