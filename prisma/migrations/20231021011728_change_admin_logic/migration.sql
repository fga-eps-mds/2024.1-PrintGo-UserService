/*
  Warnings:

  - You are about to drop the column `cargo_id` on the `users` table. All the data in the column will be lost.
  - You are about to alter the column `email` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(256)`.
  - You are about to drop the `Impressao` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Impressora` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Impressao" DROP CONSTRAINT "Impressao_impressora_id_fkey";

-- DropForeignKey
ALTER TABLE "Impressao" DROP CONSTRAINT "Impressao_user_id_fkey";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "cargo_id",
ADD COLUMN     "cargo" "Cargo"[] DEFAULT ARRAY['USER']::"Cargo"[],
ALTER COLUMN "email" SET DATA TYPE VARCHAR(256);

-- DropTable
DROP TABLE "Impressao";

-- DropTable
DROP TABLE "Impressora";

-- CreateTable
CREATE TABLE "impressoras" (
    "id" TEXT NOT NULL,
    "endereco_ip" VARCHAR(256) NOT NULL,
    "modelo" VARCHAR(256) NOT NULL,
    "localizacao" VARCHAR(256) NOT NULL,
    "marca" VARCHAR(256) NOT NULL,
    "status" "EmpressoraStatus" NOT NULL DEFAULT 'DESATIVA',
    "numero_impressora" TEXT NOT NULL,

    CONSTRAINT "impressoras_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "impressoes" (
    "id" TEXT NOT NULL,
    "impressora_id" VARCHAR(256) NOT NULL,
    "user_id" VARCHAR(256) NOT NULL,
    "data_impressao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "nome_documento" VARCHAR(256) NOT NULL,
    "numero_paginas" INTEGER NOT NULL,

    CONSTRAINT "impressoes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "impressoes" ADD CONSTRAINT "impressoes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "impressoes" ADD CONSTRAINT "impressoes_impressora_id_fkey" FOREIGN KEY ("impressora_id") REFERENCES "impressoras"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
