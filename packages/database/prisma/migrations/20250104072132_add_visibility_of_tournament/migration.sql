/*
  Warnings:

  - Added the required column `visibility` to the `Tournament` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Tournament" ADD COLUMN     "visibility" BOOLEAN NOT NULL;
