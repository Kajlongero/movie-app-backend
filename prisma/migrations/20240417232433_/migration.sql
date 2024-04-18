/*
  Warnings:

  - You are about to drop the `FilmsCategories` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "FilmsCategories" DROP CONSTRAINT "FilmsCategories_categoriesId_fkey";

-- DropForeignKey
ALTER TABLE "FilmsCategories" DROP CONSTRAINT "FilmsCategories_filmsId_fkey";

-- DropTable
DROP TABLE "FilmsCategories";

-- CreateTable
CREATE TABLE "_CategoriesToFilms" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_CategoriesToFilms_AB_unique" ON "_CategoriesToFilms"("A", "B");

-- CreateIndex
CREATE INDEX "_CategoriesToFilms_B_index" ON "_CategoriesToFilms"("B");

-- AddForeignKey
ALTER TABLE "_CategoriesToFilms" ADD CONSTRAINT "_CategoriesToFilms_A_fkey" FOREIGN KEY ("A") REFERENCES "Categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoriesToFilms" ADD CONSTRAINT "_CategoriesToFilms_B_fkey" FOREIGN KEY ("B") REFERENCES "Films"("id") ON DELETE CASCADE ON UPDATE CASCADE;
