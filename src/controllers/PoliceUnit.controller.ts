import { Request, Response } from 'express';
import { prisma } from '../database';
import { PoliceUnitCreateInput } from '../types/PoliceUnit.type';

export default {
    async createPoliceUnit(request: Request, response: Response) {
        try {
            const {
                nome,
            } = request.body as PoliceUnitCreateInput;

            const PoliceUnitExist = await prisma.unidade_Policia.findUnique({ where: { nome } });

            if (PoliceUnitExist) {
                return response.status(400).json({
                    error: true,
                    message: 'Erro: Unidade de Policia já existe!'
                });
            }

            const policeUnit = await prisma.unidade_Policia.create({
                data: {
                    nome
                }
            });

            return response.status(201).json({
                message: 'Sucesso: Unidade de Policia cadastrada com sucesso!',
                data: policeUnit
            });

        } catch (error) {
            return response.json({ error: true, message: error.message });
        }
    },

    async listPoliceUnits(request: Request, response: Response) {
        try {
            const policeUnit = await prisma.unidade_Policia.findMany();
            return response.json(policeUnit);
        } catch (error) {
            return response.status(500).json({
                error: true,
                message: 'Erro: Ocorreu um erro ao buscar as Lotações.'
            });
        }
    }
};
