import { Request, Response } from 'express';
import { prisma } from '../database';
import { UnidadeCreateInput } from '../types/Unidade.type';
import { getWorkstations } from '../services/externals/schedula.service';

export default {
    async createUnidade(request: Request, response: Response) {
        try {
            const {
                nome,
                id_unidade_referencia,
                logradouro,
                complemento,
                bairro,
                cidade,
                cep,
                numero
            } = request.body as UnidadeCreateInput;

            const unidadeExist = await prisma.unidade.findUnique({ where: { nome }});
            const unidadeDuplicated = await prisma.unidade.findMany({ where: { id_unidade_referencia: String(id_unidade_referencia)} });

            if (unidadeExist || unidadeDuplicated && unidadeDuplicated.length > 0) {
                return response.status(400).json({
                    error: true,
                    message: 'Erro: Unidade já existe!'
                });
            }

            const response_schedula = await getWorkstations(id_unidade_referencia);
            if(response_schedula.error) {
                return response.status(400).json({
                    error: true,
                    message: response_schedula.message
                });
            }
            const lotacao = await prisma.unidade.create({
                data: {
                    nome,
                    id_unidade_referencia,
                    logradouro,
                    complemento,
                    bairro,
                    cidade,
                    cep,
                    numero
                }
            });

            return response.status(201).json({
                message: 'Sucesso: Unidade cadastrada com sucesso!',
                data: lotacao
            });

        } catch (error) {
            return response.json({ error: true, message: error.message });
        }
    },

    async  listUnidades(request: Request, response: Response) {
        try {
            const lotacoes = await prisma.unidade.findMany();
            return response.json(lotacoes);
        } catch (error) {
            return response.status(500).json({
                error: true,
                message: 'Erro: Ocorreu um erro ao buscar as Unidades.'
            });
        }
    },

    async getUnidadeById(request: Request, response: Response) {
        const { id } = request.params;

        try {
            const lotacao = await prisma.unidade.findUnique({
                where: { id: String(id) },
            });

            return lotacao?
                response.json({data: lotacao}):
                response.status(404).json({
                    error: true,
                    message: 'Erro: Não foi possível encontrar a Unidade.'
                });
        } catch (error) {
            return response.status(500).json({
                error: true,
                message: 'Erro: Ocorreu um erro ao buscar  a Unidade por ID.'
            });
        }
    },
};
