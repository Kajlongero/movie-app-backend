/*
  Warnings:

  - You are about to drop the `_CategoriesToFilms` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_CategoriesToFilms" DROP CONSTRAINT "_CategoriesToFilms_A_fkey";

-- DropForeignKey
ALTER TABLE "_CategoriesToFilms" DROP CONSTRAINT "_CategoriesToFilms_B_fkey";

-- DropTable
DROP TABLE "_CategoriesToFilms";

-- CreateTable
CREATE TABLE "FilmsCategories" (
    "filmsId" INTEGER NOT NULL,
    "categoriesId" INTEGER NOT NULL,

    CONSTRAINT "FilmsCategories_pkey" PRIMARY KEY ("filmsId","categoriesId")
);

-- AddForeignKey
ALTER TABLE "FilmsCategories" ADD CONSTRAINT "FilmsCategories_filmsId_fkey" FOREIGN KEY ("filmsId") REFERENCES "Films"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FilmsCategories" ADD CONSTRAINT "FilmsCategories_categoriesId_fkey" FOREIGN KEY ("categoriesId") REFERENCES "Categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
