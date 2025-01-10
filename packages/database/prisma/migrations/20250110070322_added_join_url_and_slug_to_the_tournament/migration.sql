/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Tournament` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[joinurl]` on the table `Tournament` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `joinurl` to the `Tournament` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `Tournament` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Tournament" ADD COLUMN     "joinurl" TEXT NOT NULL,
ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Tournament_slug_key" ON "Tournament"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Tournament_joinurl_key" ON "Tournament"("joinurl");
