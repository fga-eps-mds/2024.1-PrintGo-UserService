import { Request, Response } from 'express';
import { prisma } from '../database';
import { UnidadeCreateInput } from '../types/Unidade.type';

export default {
    async createUnidade(request: Request, response: Response) {
        try {
            const {
                nome,
                logradouro,
                complemento,
                bairro,
                cidade,
                cep,
                numero
            } = request.body as UnidadeCreateInput;

            const unidadeExist = await prisma.unidade.findUnique({ where: { nome } });

            if (unidadeExist) {
                return response.status(400).json({
                    error: true,
                    message: 'Erro: Unidade já existe!'
                });
            }

            const lotacao = await prisma.unidade.create({
                data: {
                    nome,
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
