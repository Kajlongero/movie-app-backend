-- CreateTable
CREATE TABLE "FilmImages" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "filmId" INTEGER NOT NULL,

    CONSTRAINT "FilmImages_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FilmImages" ADD CONSTRAINT "FilmImages_filmId_fkey" FOREIGN KEY ("filmId") REFERENCES "Films"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
