/*
  Warnings:

  - You are about to drop the column `joiningTIme` on the `Match` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "Result" ADD VALUE 'NOT_PLAYED';

-- AlterTable
ALTER TABLE "Match" DROP COLUMN "joiningTIme";
