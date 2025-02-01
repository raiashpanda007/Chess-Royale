/*
  Warnings:

  - The values [LOSE] on the enum `Result` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Result_new" AS ENUM ('WINNER1', 'WINNER2', 'DRAW', 'NOT_PLAYED', 'PLAYING', 'UNPLAYED');
ALTER TABLE "Match" ALTER COLUMN "result" TYPE "Result_new" USING ("result"::text::"Result_new");
ALTER TYPE "Result" RENAME TO "Result_old";
ALTER TYPE "Result_new" RENAME TO "Result";
DROP TYPE "Result_old";
COMMIT;

-- AlterTable
ALTER TABLE "Tournament" ADD COLUMN     "winnerId" TEXT;

-- AddForeignKey
ALTER TABLE "Tournament" ADD CONSTRAINT "Tournament_winnerId_fkey" FOREIGN KEY ("winnerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
