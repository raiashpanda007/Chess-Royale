/*
  Warnings:

  - You are about to drop the column `timer` on the `Match` table. All the data in the column will be lost.
  - Added the required column `AddedTime` to the `Match` table without a default value. This is not possible if the table is not empty.
  - Added the required column `time` to the `Match` table without a default value. This is not possible if the table is not empty.
  - Added the required column `AddedTime` to the `Tournament` table without a default value. This is not possible if the table is not empty.
  - Added the required column `time` to the `Tournament` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Match" DROP COLUMN "timer",
ADD COLUMN     "AddedTime" INTEGER NOT NULL,
ADD COLUMN     "time" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Tournament" ADD COLUMN     "AddedTime" INTEGER NOT NULL,
ADD COLUMN     "time" INTEGER NOT NULL;
