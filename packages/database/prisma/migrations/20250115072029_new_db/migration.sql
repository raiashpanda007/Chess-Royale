/*
  Warnings:

  - The values [WIN] on the enum `Result` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `status` on the `Match` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Result_new" AS ENUM ('WINNER1', 'WINNER2', 'LOSE', 'DRAW', 'NOT_PLAYED');
ALTER TABLE "Match" ALTER COLUMN "result" TYPE "Result_new" USING ("result"::text::"Result_new");
ALTER TYPE "Result" RENAME TO "Result_old";
ALTER TYPE "Result_new" RENAME TO "Result";
DROP TYPE "Result_old";
COMMIT;

-- AlterTable
ALTER TABLE "Match" DROP COLUMN "status";

-- DropEnum
DROP TYPE "StatusMatch";
