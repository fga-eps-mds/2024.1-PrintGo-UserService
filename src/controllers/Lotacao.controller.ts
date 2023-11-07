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
                unidade_pai_id,
                numero
            } = request.body as LotacaoCreateInput;

            const policeUnit = await prisma.unidade_Policia.findUnique({ where: { id: String(unidade_pai_id) } }).catch(err => {
                console.error('Error querying unidade policia:', err);
            });

            if(!policeUnit) {
                return response.status(400).json({
                    error: true,
                    message: 'Erro: Unidade de policia não encontrada!'
                });
            }

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
                    unidade_pai_id,
                    numero
                }
            });

            return response.status(201).json({
                message: 'Sucesso: Lotação cadastrada com sucesso!',
                data: lotacao
            });

        } catch (error) {
            return response.json({ error: true, message: error.message });
        }
    },

    async  listLotacoes(request: Request, response: Response) {
        try {
            const lotacoes = await prisma.lotacao.findMany();
            return response.json(lotacoes);
        } catch (error) {
            return response.status(500).json({
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
                response.json({data: lotacao}):
                response.status(404).json({
                    error: true,
                    message: 'Erro: Não foi possível encontrar a lotação.'
                });
        } catch (error) {
            return response.status(500).json({
                error: true,
                message: 'Erro: Ocorreu um erro ao buscar  a lotação por ID.'
            });
        }
    },
};
