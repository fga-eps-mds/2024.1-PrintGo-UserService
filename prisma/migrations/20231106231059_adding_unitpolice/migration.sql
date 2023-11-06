/*
  Warnings:

  - Added the required column `unidade_pai_id` to the `lotacoes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "lotacoes" ADD COLUMN     "unidade_pai_id" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Unidade_Policia" (
    "id" TEXT NOT NULL,
    "nome" VARCHAR(256) NOT NULL,

    CONSTRAINT "Unidade_Policia_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "lotacoes" ADD CONSTRAINT "lotacoes_unidade_pai_id_fkey" FOREIGN KEY ("unidade_pai_id") REFERENCES "Unidade_Policia"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
