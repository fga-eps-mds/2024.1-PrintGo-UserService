-- CreateEnum
CREATE TYPE "EmpressoraStatus" AS ENUM ('ATIVA', 'DESATIVA');

-- CreateEnum
CREATE TYPE "Cargo" AS ENUM ('USER', 'ADMIN');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" VARCHAR(256) NOT NULL,
    "nome" VARCHAR(256),
    "documento" VARCHAR(14) NOT NULL,
    "lotacao_id" VARCHAR(256) NOT NULL,
    "cargos" "Cargo"[] DEFAULT ARRAY['USER']::"Cargo"[],

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lotacoes" (
    "id" TEXT NOT NULL,
    "nome" VARCHAR(256) NOT NULL,
    "rua" VARCHAR(256) NOT NULL,
    "logradouro" VARCHAR(256) NOT NULL,
    "complemento" VARCHAR(256) NOT NULL,
    "bairro" VARCHAR(256) NOT NULL,
    "cidade" VARCHAR(256) NOT NULL,
    "cep" VARCHAR(256) NOT NULL,
    "numero" INTEGER NOT NULL,

    CONSTRAINT "lotacoes_pkey" PRIMARY KEY ("id")
);

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

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "lotacoes_nome_key" ON "lotacoes"("nome");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_lotacao_id_fkey" FOREIGN KEY ("lotacao_id") REFERENCES "lotacoes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "impressoes" ADD CONSTRAINT "impressoes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "impressoes" ADD CONSTRAINT "impressoes_impressora_id_fkey" FOREIGN KEY ("impressora_id") REFERENCES "impressoras"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
