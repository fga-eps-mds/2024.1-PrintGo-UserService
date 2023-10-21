import { Request, Response } from 'express';
import { prisma } from '../database';
import { UserCreateInput } from '../types/User.type';



export default {
    async createUser(request: Request, response: Response) {
        try {
            const { nome, email, documento, lotacao_id, cargos } = request.body as UserCreateInput;
            const emailExist = await prisma.user.findUnique({ where: { email } });

            // validador de cpf e cnp


            if (emailExist) {
                return response.json({
                    error: true,
                    message: 'Erro: Já existe usuário com esse email!'
                });
            }

            const user = await prisma.user.create({
                data: {
                    nome,
                    email,
                    documento,
                    lotacao_id,
                    cargos: {
                        set: cargos
                    }
                }

            });

            return response.json({
                error: null,
                message: 'Sucesso: Usuário cadastrado com sucesso!',
                user
            });

        } catch (error) {
            return response.json({ message: error.message });
        }
    }
};