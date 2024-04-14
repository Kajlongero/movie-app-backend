-- CreateEnum
CREATE TYPE "MEDIA_TYPE" AS ENUM ('TV', 'MOVIE');

-- CreateEnum
CREATE TYPE "EPISODE_TYPE" AS ENUM ('STANDARD', 'FINALE');

-- CreateEnum
CREATE TYPE "REVIEW_COMMENTS_ACTION_TYPE" AS ENUM ('EDITED', 'DELETED');

-- CreateTable
CREATE TABLE "Auth" (
    "id" TEXT NOT NULL,
    "email" VARCHAR(75) NOT NULL,
    "password" VARCHAR(120) NOT NULL,
    "confirmed" BOOLEAN NOT NULL DEFAULT false,
    "loginAttempts" INTEGER NOT NULL DEFAULT 0,
    "confirmAttempts" INTEGER NOT NULL DEFAULT 1,
    "recoveryPasswordAttempts" INTEGER NOT NULL DEFAULT 0,
    "timeToLoginAgain" TIMESTAMP(3),
    "time_to_request_confirm_again" TIMESTAMP(3),
    "time_to_request_password_recovery" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Auth_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuthConfirm" (
    "id" TEXT NOT NULL,
    "code" INTEGER NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "valid" BOOLEAN NOT NULL DEFAULT true,
    "lifetime" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "authId" TEXT NOT NULL,

    CONSTRAINT "AuthConfirm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuthRecovery" (
    "id" TEXT NOT NULL,
    "code" INTEGER NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "recovery_token" TEXT NOT NULL,
    "authorize_change_token" TEXT NOT NULL,
    "valid" BOOLEAN NOT NULL DEFAULT true,
    "lifetime" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "authId" TEXT NOT NULL,

    CONSTRAINT "AuthRecovery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Users" (
    "id" TEXT NOT NULL,
    "first_name" TEXT,
    "last_name" TEXT,
    "authId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Films" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "overview" TEXT NOT NULL,
    "media_type" "MEDIA_TYPE" NOT NULL,
    "popularity" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
    "voteAverage" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
    "voteCount" INTEGER NOT NULL DEFAULT 0,
    "releaseDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Films_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Seasons" (
    "id" SERIAL NOT NULL,
    "season_number" INTEGER NOT NULL,
    "episode_count" INTEGER NOT NULL,
    "vote_count" INTEGER NOT NULL DEFAULT 0,
    "filmId" INTEGER NOT NULL,
    "vote_average" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
    "name" TEXT NOT NULL,
    "overview" TEXT NOT NULL,
    "media_type" "MEDIA_TYPE" NOT NULL,
    "air_date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Seasons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Episodes" (
    "id" SERIAL NOT NULL,
    "season_number" INTEGER NOT NULL,
    "runtime" INTEGER NOT NULL DEFAULT 0,
    "vote_count" INTEGER NOT NULL DEFAULT 0,
    "season_id" INTEGER NOT NULL,
    "vote_average" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
    "name" TEXT NOT NULL,
    "overview" TEXT NOT NULL,
    "episode_type" "EPISODE_TYPE" NOT NULL DEFAULT 'STANDARD',
    "air_date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Episodes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommentsReview" (
    "id" SERIAL NOT NULL,
    "score" INTEGER NOT NULL,
    "film_id" INTEGER NOT NULL,
    "content" VARCHAR(300) NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CommentsReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommentsReviewHistory" (
    "id" SERIAL NOT NULL,
    "score" INTEGER NOT NULL,
    "comment_id" INTEGER NOT NULL,
    "content" VARCHAR(300) NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "CommentsReviewHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Categories" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chat" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category_id" INTEGER NOT NULL,

    CONSTRAINT "Chat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatMessage" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "chat_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "ChatMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CategoriesToFilms" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Auth_email_key" ON "Auth"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Chat_category_id_key" ON "Chat"("category_id");

-- CreateIndex
CREATE UNIQUE INDEX "_CategoriesToFilms_AB_unique" ON "_CategoriesToFilms"("A", "B");

-- CreateIndex
CREATE INDEX "_CategoriesToFilms_B_index" ON "_CategoriesToFilms"("B");

-- AddForeignKey
ALTER TABLE "AuthConfirm" ADD CONSTRAINT "AuthConfirm_authId_fkey" FOREIGN KEY ("authId") REFERENCES "Auth"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuthRecovery" ADD CONSTRAINT "AuthRecovery_authId_fkey" FOREIGN KEY ("authId") REFERENCES "Auth"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Users" ADD CONSTRAINT "Users_authId_fkey" FOREIGN KEY ("authId") REFERENCES "Auth"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Seasons" ADD CONSTRAINT "Seasons_filmId_fkey" FOREIGN KEY ("filmId") REFERENCES "Films"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Episodes" ADD CONSTRAINT "Episodes_season_id_fkey" FOREIGN KEY ("season_id") REFERENCES "Seasons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentsReview" ADD CONSTRAINT "CommentsReview_film_id_fkey" FOREIGN KEY ("film_id") REFERENCES "Films"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentsReview" ADD CONSTRAINT "CommentsReview_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentsReviewHistory" ADD CONSTRAINT "CommentsReviewHistory_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "CommentsReview"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentsReviewHistory" ADD CONSTRAINT "CommentsReviewHistory_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "Chat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoriesToFilms" ADD CONSTRAINT "_CategoriesToFilms_A_fkey" FOREIGN KEY ("A") REFERENCES "Categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoriesToFilms" ADD CONSTRAINT "_CategoriesToFilms_B_fkey" FOREIGN KEY ("B") REFERENCES "Films"("id") ON DELETE CASCADE ON UPDATE CASCADE;
