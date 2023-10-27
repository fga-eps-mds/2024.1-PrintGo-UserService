#!/bin/bash
if [ "$ENV" == "dev" ]; then
    yarn db:generate
    yarn db:push
elif [ "$ENV" == "prod" ]; then
    echo "Modo PROD ativado"
fi