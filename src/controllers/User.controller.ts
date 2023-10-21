import { Request, Response } from 'express';
import { prisma } from '../database';
import { UserCreateInput } from '../types/User.type';
import { checkCpfOrCnpj } from '../middlewares/checkCpfOrCnpj.middleware';

export default {
    async createUser(request: Request, response: Response) {
        try {
            const { nome, email, documento, lotacao_id, cargos } = request.body as UserCreateInput;
            const emailExist = await prisma.user.findUnique({ where: { email } });

            if(checkCpfOrCnpj(documento)) {
                return response.status(400).json({
                    error: 'Erro: CPF ou CNPJ inválido!'
                });
            }

            if (emailExist) {
                return response.status(400).json({
                    error: 'Erro: Já existe usuário com esse email!'
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
            return response.status(500).json({ error: error.message });
        }
    },
    

    async  listUsers(request: Request, response: Response) {
        try {
            const users = await prisma.lotacao.findMany();
            return response.json(users);
        } catch (error) {
            response.status(500).json({ error: 'Ocorreu um erro ao buscar os Usuarios.' });
        }
    },

    
    async getUserById(request: Request, response: Response) {
        const { id } = request.params;
    
        try {
            const user = await prisma.user.findUnique({
                where: { id: String(id) },
            });
    
            return user? 
                response.json(user):
                response.status(404).json({ error: 'Não foi possível encontrar o usuario.'});
        } catch (error) {
            response.status(500).json({ error: 'Ocorreu um erro ao buscar  o usuario por ID.' });
        }
    },
    
};