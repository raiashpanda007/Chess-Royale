/*
  Warnings:

  - The values [CREATE] on the enum `StatusMatch` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "StatusMatch_new" AS ENUM ('CREATED', 'START', 'FINISH');
ALTER TABLE "Match" ALTER COLUMN "status" TYPE "StatusMatch_new" USING ("status"::text::"StatusMatch_new");
ALTER TYPE "StatusMatch" RENAME TO "StatusMatch_old";
ALTER TYPE "StatusMatch_new" RENAME TO "StatusMatch";
DROP TYPE "StatusMatch_old";
COMMIT;
