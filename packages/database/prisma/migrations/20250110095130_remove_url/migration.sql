/*
  Warnings:

  - You are about to drop the column `joinurl` on the `Tournament` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Tournament_joinurl_key";

-- AlterTable
ALTER TABLE "Tournament" DROP COLUMN "joinurl";
