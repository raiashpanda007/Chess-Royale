/*
  Warnings:

  - You are about to drop the `SoloGame` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
ALTER TYPE "Result" ADD VALUE 'PLAYING';

-- DropForeignKey
ALTER TABLE "SoloGame" DROP CONSTRAINT "SoloGame_playerId_fkey";

-- DropTable
DROP TABLE "SoloGame";
