/*
  Warnings:

  - You are about to drop the column `confirmAttempts` on the `Auth` table. All the data in the column will be lost.
  - You are about to drop the column `loginAttempts` on the `Auth` table. All the data in the column will be lost.
  - You are about to drop the column `recoveryPasswordAttempts` on the `Auth` table. All the data in the column will be lost.
  - You are about to drop the column `timeToLoginAgain` on the `Auth` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `ChatMessage` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `ChatMessage` table. All the data in the column will be lost.
  - Added the required column `updated_at` to the `ChatMessage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Auth" DROP COLUMN "confirmAttempts",
DROP COLUMN "loginAttempts",
DROP COLUMN "recoveryPasswordAttempts",
DROP COLUMN "timeToLoginAgain",
ADD COLUMN     "confirm_attempts" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "login_attempts" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "recovery_password_attempts" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "time_to_login_again" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "ChatMessage" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;
