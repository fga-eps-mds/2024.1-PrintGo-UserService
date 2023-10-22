import { Request, Response } from 'express';
import { prisma } from '../database';
import { LotacaoCreateInput } from '../types/Lotacao.type';

export default {
    async createLotacao(request: Request, response: Response) {
        try {
            const {
                nome,
                rua,
                logradouro,
                complemento,
                bairro,
                cidade,
                cep,
                numero
            } = request.body as LotacaoCreateInput;

            const lotacaoExist = await prisma.lotacao.findUnique({ where: { nome } });

            if (lotacaoExist) {
                return response.status(400).json({
                    error: true,
                    message: 'Erro: Lotação já existe!'
                });
            }

            const lotacao = await prisma.lotacao.create({
                data: {
                    nome,
                    rua,
                    logradouro,
                    complemento,
                    bairro,
                    cidade,
                    cep,
                    numero
                }
            });

            return response.status(201).json({
                message: 'Sucesso: Lotação cadastrada com sucesso!',
                lotacao
            });

        } catch (error) {
            return response.json({ error: true, message: error.message });
        }
    },

    async  listLotacoes(request: Request, response: Response) {
        try {
            const lotacoes = await prisma.lotacao.findMany();
            response.json(lotacoes);
        } catch (error) {
            response.status(500).json({
                error: true,
                message: 'Erro: Ocorreu um erro ao buscar as Lotações.'
            });
        }
    },

    async getLotacaoById(request: Request, response: Response) {
        const { id } = request.params;

        try {
            const lotacao = await prisma.lotacao.findUnique({
                where: { id: String(id) },
            });

            return lotacao?
                response.json(lotacao):
                response.status(404).json({
                    error: true,
                    message: 'Erro: Não foi possível encontrar a lotação.'
                });
        } catch (error) {
            response.status(500).json({
                error: true,
                message: 'Erro: Ocorreu um erro ao buscar  a lotação por ID.'
            });
        }
    },
};
