/*
  Warnings:

  - You are about to drop the column `cargo` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "cargo",
ADD COLUMN     "cargos" TEXT[] DEFAULT ARRAY['USER']::TEXT[];

-- DropEnum
DROP TYPE "Cargo";
