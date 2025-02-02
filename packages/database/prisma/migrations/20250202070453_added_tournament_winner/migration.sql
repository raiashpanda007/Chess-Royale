/*
  Warnings:

  - You are about to drop the column `winnerId` on the `Tournament` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Tournament" DROP CONSTRAINT "Tournament_winnerId_fkey";

-- AlterTable
ALTER TABLE "Tournament" DROP COLUMN "winnerId";

-- CreateTable
CREATE TABLE "TournamentWinner" (
    "tournamentId" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,

    CONSTRAINT "TournamentWinner_pkey" PRIMARY KEY ("tournamentId","playerId")
);

-- AddForeignKey
ALTER TABLE "TournamentWinner" ADD CONSTRAINT "TournamentWinner_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournament"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TournamentWinner" ADD CONSTRAINT "TournamentWinner_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
