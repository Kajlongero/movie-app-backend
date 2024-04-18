/*
  Warnings:

  - You are about to drop the column `filmId` on the `FilmImages` table. All the data in the column will be lost.
  - You are about to drop the column `releaseDate` on the `Films` table. All the data in the column will be lost.
  - You are about to drop the column `voteAverage` on the `Films` table. All the data in the column will be lost.
  - You are about to drop the column `voteCount` on the `Films` table. All the data in the column will be lost.
  - You are about to drop the column `filmId` on the `Seasons` table. All the data in the column will be lost.
  - You are about to drop the column `media_type` on the `Seasons` table. All the data in the column will be lost.
  - You are about to drop the column `authId` on the `Users` table. All the data in the column will be lost.
  - Added the required column `film_id` to the `FilmImages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cover_image` to the `Films` table without a default value. This is not possible if the table is not empty.
  - Added the required column `release_date` to the `Films` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cover_image` to the `Seasons` table without a default value. This is not possible if the table is not empty.
  - Added the required column `film_id` to the `Seasons` table without a default value. This is not possible if the table is not empty.
  - Added the required column `auth_id` to the `Users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "FilmImages" DROP CONSTRAINT "FilmImages_filmId_fkey";

-- DropForeignKey
ALTER TABLE "Seasons" DROP CONSTRAINT "Seasons_filmId_fkey";

-- DropForeignKey
ALTER TABLE "Users" DROP CONSTRAINT "Users_authId_fkey";

-- AlterTable
ALTER TABLE "FilmImages" DROP COLUMN "filmId",
ADD COLUMN     "film_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Films" DROP COLUMN "releaseDate",
DROP COLUMN "voteAverage",
DROP COLUMN "voteCount",
ADD COLUMN     "cover_image" TEXT NOT NULL,
ADD COLUMN     "release_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "vote_average" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
ADD COLUMN     "vote_count" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Seasons" DROP COLUMN "filmId",
DROP COLUMN "media_type",
ADD COLUMN     "cover_image" TEXT NOT NULL,
ADD COLUMN     "film_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Users" DROP COLUMN "authId",
ADD COLUMN     "auth_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Users" ADD CONSTRAINT "Users_auth_id_fkey" FOREIGN KEY ("auth_id") REFERENCES "Auth"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FilmImages" ADD CONSTRAINT "FilmImages_film_id_fkey" FOREIGN KEY ("film_id") REFERENCES "Films"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Seasons" ADD CONSTRAINT "Seasons_film_id_fkey" FOREIGN KEY ("film_id") REFERENCES "Films"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
