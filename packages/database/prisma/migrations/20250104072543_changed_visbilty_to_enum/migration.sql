/*
  Warnings:

  - Changed the type of `visibility` on the `Tournament` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Visibility" AS ENUM ('PUBLIC', 'PRIVATE');

-- AlterTable
ALTER TABLE "Tournament" DROP COLUMN "visibility",
ADD COLUMN     "visibility" "Visibility" NOT NULL;
