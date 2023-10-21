/*
  Warnings:

  - You are about to alter the column `impressora_id` on the `Impressao` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(256)`.
  - You are about to alter the column `user_id` on the `Impressao` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(256)`.
  - You are about to alter the column `nome_documento` on the `Impressao` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(256)`.
  - You are about to alter the column `endereco_ip` on the `Impressora` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(256)`.
  - You are about to alter the column `modelo` on the `Impressora` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(256)`.
  - You are about to alter the column `localizacao` on the `Impressora` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(256)`.
  - You are about to alter the column `marca` on the `Impressora` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(256)`.
  - The `status` column on the `Impressora` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to alter the column `nome` on the `lotacoes` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(256)`.
  - You are about to alter the column `rua` on the `lotacoes` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(256)`.
  - You are about to alter the column `logradouro` on the `lotacoes` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(256)`.
  - You are about to alter the column `complemento` on the `lotacoes` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(256)`.
  - You are about to alter the column `bairro` on the `lotacoes` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(256)`.
  - You are about to alter the column `cidade` on the `lotacoes` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(256)`.
  - You are about to alter the column `cep` on the `lotacoes` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(256)`.
  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(256)`.
  - You are about to alter the column `nome` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(256)`.
  - You are about to alter the column `lotacao_id` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(256)`.
  - A unique constraint covering the columns `[nome]` on the table `lotacoes` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "EmpressoraStatus" AS ENUM ('ATIVA', 'DESATIVA');

-- DropForeignKey
ALTER TABLE "Impressao" DROP CONSTRAINT "Impressao_impressora_id_fkey";

-- DropForeignKey
ALTER TABLE "Impressao" DROP CONSTRAINT "Impressao_user_id_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_lotacao_id_fkey";

-- AlterTable
ALTER TABLE "Impressao" ALTER COLUMN "impressora_id" SET DATA TYPE VARCHAR(256),
ALTER COLUMN "user_id" SET DATA TYPE VARCHAR(256),
ALTER COLUMN "nome_documento" SET DATA TYPE VARCHAR(256);

-- AlterTable
ALTER TABLE "Impressora" ALTER COLUMN "endereco_ip" SET DATA TYPE VARCHAR(256),
ALTER COLUMN "modelo" SET DATA TYPE VARCHAR(256),
ALTER COLUMN "localizacao" SET DATA TYPE VARCHAR(256),
ALTER COLUMN "marca" SET DATA TYPE VARCHAR(256),
DROP COLUMN "status",
ADD COLUMN     "status" "EmpressoraStatus" NOT NULL DEFAULT 'DESATIVA';

-- AlterTable
ALTER TABLE "lotacoes" ALTER COLUMN "nome" SET DATA TYPE VARCHAR(256),
ALTER COLUMN "rua" SET DATA TYPE VARCHAR(256),
ALTER COLUMN "logradouro" SET DATA TYPE VARCHAR(256),
ALTER COLUMN "complemento" SET DATA TYPE VARCHAR(256),
ALTER COLUMN "bairro" SET DATA TYPE VARCHAR(256),
ALTER COLUMN "cidade" SET DATA TYPE VARCHAR(256),
ALTER COLUMN "cep" SET DATA TYPE VARCHAR(256);

-- AlterTable
ALTER TABLE "users" DROP CONSTRAINT "users_pkey",
ALTER COLUMN "id" SET DATA TYPE VARCHAR(256),
ALTER COLUMN "nome" SET DATA TYPE VARCHAR(256),
ALTER COLUMN "lotacao_id" SET DATA TYPE VARCHAR(256),
ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "lotacoes_nome_key" ON "lotacoes"("nome");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_lotacao_id_fkey" FOREIGN KEY ("lotacao_id") REFERENCES "lotacoes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Impressao" ADD CONSTRAINT "Impressao_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Impressao" ADD CONSTRAINT "Impressao_impressora_id_fkey" FOREIGN KEY ("impressora_id") REFERENCES "Impressora"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
