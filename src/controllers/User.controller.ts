import { Request, Response } from 'express';
import { prisma } from '../database';
import { checkCpfOrCnpj } from '../middlewares/checkCpfOrCnpj.middleware';
import { UserCreateInput } from '../types/User.type';

export default {
    async createUser(request: Request, response: Response) {
        try {
            const { nome, email, documento, lotacao_id, cargos } = request.body as UserCreateInput;
            const emailExist = await prisma.user.findUnique({ where: { email } });

            if(!checkCpfOrCnpj(documento)) {
                return response.status(400).json({
                    error: true,
                    message: 'Erro: CPF ou CNPJ inválido!'
                });
            }

            if (emailExist) {
                return response.status(400).json({
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

            return response.status(201).json({
                message: 'Sucesso: Usuário cadastrado com sucesso!',
                user
            });

        } catch (error) {
            return response.status(500).json({
                error: true,
                message: error.message
            });
        }
    },


    async  listUsers(request: Request, response: Response) {
        try {
            const users = await prisma.user.findMany();
            return response.json(users);
        } catch (error) {
            response.status(500).json({
                error: true,
                message: 'Erro: Ocorreu um erro ao buscar os Usuarios.'
            });
        }
    },


    async getUserById(request: Request, response: Response) {
        try {
            const { id } = request.params;
            const user = await prisma.user.findUnique({
                where: { id: String(id) },
            });

            return user?
                response.json(user):
                response.status(404).json({
                    error: true,
                    message: 'Erro: Não foi possível encontrar o usuario.'});
        } catch (error) {
            response.status(500).json({
                error: true,
                message: 'Erro: Ocorreu um erro ao buscar  o usuario por ID.' });
        }
    },

    async updateUser(request: Request, response: Response) {
        try {
            const { id } = request.params;
            const userInput = request.body;

            if(userInput.documento && !checkCpfOrCnpj(userInput.documento)) {
                return response.status(400).json({
                    error: true,
                    message: 'Erro: CPF ou CNPJ inválido!'
                });
            }

            if(userInput.lotacao_id) {
                const lotacaoExist = await prisma.lotacao.findUnique({ where: { id: String(userInput.lotacao_id) } });
                if (!lotacaoExist) {
                    return response.status(400).json({
                        error: true,
                        message: 'Erro: Lotação não encontrada!'
                    });
                }
            }
            const user = await prisma.user.findUnique({
                where: { id: String(id) },
            });

            if (!user) {
                return response.status(404).json({ error: 'Erro: Usuário não encontrado.' });
            }

            const userUpdated = await prisma.user.update({
                where: {
                    id: String(id)
                },
                data: userInput
            });

            return response.status(200).json({
                message: 'Sucesso: Usuário atualizado com sucesso!',
                userUpdated
            });


        } catch (error) {
            response.status(500).json({ error: error.message });
        }
    },

};