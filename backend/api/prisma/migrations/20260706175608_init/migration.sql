/*
  Warnings:

  - You are about to alter the column `confidence` on the `alerts` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Real`.

*/
-- AlterTable
ALTER TABLE "alerts" ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "confidence" SET DATA TYPE REAL;

-- AlterTable
ALTER TABLE "cameras" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "user_cameras" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "id" DROP DEFAULT;
