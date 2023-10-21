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
                return response.json({
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

            return response.json({
                error: false,
                message: 'Sucesso: Lotação cadastrada com sucesso!',
                lotacao
            });

        } catch (error) {
            return response.json({ error: true, message: error.message });
        }
    }
};
