# 2023.2-PrintGo-UserService

<div align="center">
     <img src="assets/logoPrintGo.svg" height="350px" width="350px">
</div>

## Quality Control

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=fga-eps-mds_2023.2-PrintGo-BackEnd&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=fga-eps-mds_2023.2-PrintGo-BackEnd)

[![codecov](https://codecov.io/gh/fga-eps-mds/2023.2-PrintGo-UserService/graph/badge.svg?token=g0er9UGKLc)](https://codecov.io/gh/fga-eps-mds/2023.2-PrintGo-UserService)

## Sobre

O PrintGo é um sistema produzido para a PC-GO cuja função é monitorar ativos de impressão. A ferramenta, que é de fácil uso, auxilia na contagem de impressões na hora de prestação de contas e para isso apresenta um dashboard que pode ser transformado em relatórios.

Aplicação disponível em: [link da aplicação](?)

## Requisitos

- Node.js 18.18 (Latest em 10-05-2023)
- Docker
- Docker-compose



### Instalação

```bash
# 1. Clone o projeto
git clone git@github.com:fga-eps-mds/2023.2-PrintGo-UserService.git

# 2. Entre na pasta do projeto
cd 2023.2-PrintGo-UserService

# Caso prefira usar yarn eh n tenha
npm i -g yarn

# Instalar dependencias
yarn
    #ou
npm i

###
# crie um arquivo no diretorio root chamado .env
# nele sera necessario a definição das seguintes variaveis para testar localmente
#
# POSTGRES_USER="postgres"
# POSTGRES_PASSWORD="postgres"
# POSTGRES_DB="postgres"
# DATABASE_URL="postgresql://postgres:postgres@localhost:5432/postgres?schema=public"
#
###

# Rode o docker compose do projeto
docker-compose up --build
    # --build somente eh necessario na primeira vez que estiver rodando
    # depois `docker-compose up` ja resolve
    # em linux talvez seja necessario a execucao em modo root `sudo docker-compose up`

# finalizado execução do docker faca o migrate da base de dados
yarn db:migrate
    #ou
npm run db:migrate
```

## Contribuir

Para contribuir com esse projeto é importante seguir nosso [Guia de Contribuição](https://fga-eps-mds.github.io/2023.2-PrintGo-Doc/guia_de_contribuicao/) do repositório e seguir nosso [Código de Conduta](https://fga-eps-mds.github.io/2023.2-PrintGo-Doc/codigo_conduta/).

## Ambientes

- [Documentação](https://github.com/fga-eps-mds/2023.2-PrintGo-Doc)

- [Front-End](https://github.com/fga-eps-mds/2023.2-PrintGo-FrontEnd)

- [Back-End: UserService](https://github.com/fga-eps-mds/2023.2-PrintGo-UserService)

