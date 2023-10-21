-- CreateEnum
CREATE TYPE "Cargo" AS ENUM ('USER', 'ADMIN');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "nome" TEXT,
    "documento" VARCHAR(14) NOT NULL,
    "lotacao_id" TEXT NOT NULL,
    "cargo_id" "Cargo" NOT NULL DEFAULT 'USER',

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lotacoes" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "rua" TEXT NOT NULL,
    "logradouro" TEXT NOT NULL,
    "complemento" TEXT NOT NULL,
    "bairro" TEXT NOT NULL,
    "cidade" TEXT NOT NULL,
    "cep" TEXT NOT NULL,
    "numero" INTEGER NOT NULL,

    CONSTRAINT "lotacoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Impressora" (
    "id" TEXT NOT NULL,
    "endereco_ip" TEXT NOT NULL,
    "modelo" TEXT NOT NULL,
    "localizacao" TEXT NOT NULL,
    "marca" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "numero_impressora" TEXT NOT NULL,

    CONSTRAINT "Impressora_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Impressao" (
    "id" TEXT NOT NULL,
    "impressora_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "data_impressao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "nome_documento" TEXT NOT NULL,
    "numero_paginas" INTEGER NOT NULL,

    CONSTRAINT "Impressao_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_lotacao_id_fkey" FOREIGN KEY ("lotacao_id") REFERENCES "lotacoes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Impressao" ADD CONSTRAINT "Impressao_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Impressao" ADD CONSTRAINT "Impressao_impressora_id_fkey" FOREIGN KEY ("impressora_id") REFERENCES "Impressora"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
