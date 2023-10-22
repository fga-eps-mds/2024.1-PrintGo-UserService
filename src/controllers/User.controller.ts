import { Request, Response } from 'express';
import { prisma } from '../database';
import { checkCpfOrCnpj } from '../middlewares/checkCpfOrCnpj.middleware';
import { UserCreateInput } from '../types/User.type';
import { encryptPassword } from '../adapters/bcrypt.adapter';
import  jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';


export default {
    async createUser(request: Request, response: Response) {
        try {
            const { nome, email, senha, documento, lotacao_id, cargos } = request.body as UserCreateInput;
            const emailExist = await prisma.user.findUnique({ where: { email } });
            const lotacaoExist = await prisma.lotacao.findUnique({ where: { id: lotacao_id } });

            if(!lotacaoExist) {
                return response.status(400).json({
                    error: true,
                    message: 'Erro: Lotação não encontrada!'
                });
            }

            if(!documento || !checkCpfOrCnpj(documento)) {
                return response.status(400).json({
                    error: true,
                    message: 'Erro: CPF ou CNPJ inválido!'
                });
            }

            if (!senha || senha.length < 8) {
                return response.status(400).json({
                    error: true,
                    message: 'Erro: senha deve ter no mínimo 8 caracteres!'
                });
            }

            if (emailExist) {
                return response.status(400).json({
                    error: true,
                    message: 'Erro: Já existe usuário com esse email!'
                });
            }

            const senhaCryptografada = encryptPassword(senha);

            const user = await prisma.user.create({
                data: {
                    nome,
                    email,
                    senha: senhaCryptografada,
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

    async login(request: Request, response: Response) {
        try {
            const { email, senha } = request.body;
    
            const user = await prisma.user.findUnique({
                where: {
                    email: email,
                },
            });

            const id = user.id
    
            if (user && bcrypt.compareSync(senha, user.senha)) {
                // Criar e assinar o token
                const token = jwt.sign({
                    id, 
                    email 
                }, 'segredo', { expiresIn: '1h' });
    
                response.json({ token });
            } else {
                response.status(401).json({ message: 'E-mail ou senha inválidos' });
            }
        } catch (error) {
            // Tratar o erro
            console.error(error);
            response.status(500).json({ message: 'Ocorreu um erro inesperado' });
        }
    },

    async mudancaSenha(request: Request, response: Response) {
      try {
        const { novaSenha, confirmacaoNovaSenha } = request.body;

        if (!novaSenha || !confirmacaoNovaSenha) {
            return response.status(400).json({ message: 'Nova senha e confirmação da nova senha são obrigatórios.'});
        }
        
        if (novaSenha !== confirmacaoNovaSenha) {
            return response.status(400).json({ message: 'Nova senha e confirmação da nova senha são obrigatórios.'});
        }

        const senhaCryptografada = encryptPassword(novaSenha);

        const token = request.headers['authorization'];

        if (!token) {
            response.status(500)   
        }

        const decoded = jwt.verify(token, 'segredo')

        const userUpdated = await prisma.user.update({
            where: {
                id: String(decoded.id)
            },
            data: {
                senha: senhaCryptografada
            }
        });

        response.status(200).json({ message: 'Senha atualizada com sucesso!', userUpdated})


      } catch(error) {
        response.status(500).json({ error: error.message });
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