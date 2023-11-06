/*
  Warnings:

  - A unique constraint covering the columns `[nome]` on the table `Unidade_Policia` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Unidade_Policia_nome_key" ON "Unidade_Policia"("nome");
