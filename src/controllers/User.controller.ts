import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { encryptPassword } from '../adapters/bcrypt.adapter';
import { prisma } from '../database';
import { checkCpfOrCnpj } from '../middlewares/checkCpfOrCnpj.middleware';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

export default {
    async createUser(request: Request, response: Response) {
        try {
            const {
                nome,
                email,
                senha,
                documento,
                unidade_id,
                cargos
            } = request.body;

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

            const emailExist = await prisma.user.findUnique({ where: { email: String(email) } });

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
                    unidade_id,
                    cargos: {
                        set: cargos
                    }
                }

            });

            return response.status(201).json({
                message: 'Sucesso: Usuário cadastrado com sucesso!',
                data: user
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

            const {id, nome, cargos} = user;
            

            if (user && bcrypt.compareSync(senha, user.senha)) {
                // Criar e assinar o token
                const token = jwt.sign({
                    id,
                    email,
                    nome,
                    cargos
                }, 'segredo', { expiresIn: '1h' });

                return response.json({ token });
            } else {
                return response.status(401).json({ message: 'E-mail ou senha inválidos' });
            }
        } catch (error) {
            return response.status(500).json({ message: 'Ocorreu um erro inesperado' });
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
                return response.status(500);
            }

            const decoded = jwt.verify(token, 'segredo');


            const userUpdated = await prisma.user.update({
                where: {
                    id: String(decoded.id)
                },
                data: {
                    senha: senhaCryptografada
                }
            });

            return response.status(200).json({ message: 'Senha atualizada com sucesso!', userUpdated});


        } catch(error) {
            return response.status(500).json({ error: error.message });
        }

    },

    async esqueciSenha(request: Request, response: Response) {
        try {
            const { email } = request.body;

            const user = await prisma.user.findUnique({
                where: {
                    email: email,
                },
            });

            if (!user) {
                return response.status(404).json({ message: 'Usuário não encontrado.' });

            }

            const token = crypto.randomBytes(20).toString('hex');
            const now = new Date();
            now.setHours(now.getHours() + 1);

            await prisma.user.update({
                where: {
                    id: user.id,
                },
                data: {
                    resetPasswordToken: token,
                    resetPasswordExpires: now.toISOString(),
                },
            });
            const transporter = nodemailer.createTransport({
                host: process.env.SMPT_HOST,
                port: process.env.SMPT_PORT,
                secure: false,
                auth: {
                    user: process.env.SMPT_MAIL,
                    pass: process.env.SMPT_PASSWORD,
                },
            });

            const resetLink = `${process.env.FRONT_URL}/recuperarSenha?token=${token}`;
            const emailContent = `
            <p>Olá, você poderá redefinir sua senha para acessar o sistema.</p>
            <p>Clique no seguinte link para redefinir sua senha:</p>
            <a href="${resetLink}">${resetLink}</a>
            `;

            await transporter.sendMail({
                from: process.env.SMPT_MAIL,
                to: email,
                subject: 'Recuperação de Senha',
                context: { token},
                html: emailContent,
            });

            return response.status(201).json({ message: 'Email de recuperação enviado com sucesso.', token: token });
        } catch (error) {
            return response.status(500).json({ message: 'Ocorreu um erro inesperado.' });
        }
    },

    async  resetPassword(request: Request, response: Response) {
        try {
            const { senha, token} = request.body;

            if (!token || typeof token !== 'string') {
                return response.status(400).json({ message: 'Token inválido.' });
            }
            const user = await prisma.user.findFirst({
                where: {
                    resetPasswordToken: token,
                },
            });

            if (!user) {
                return response.status(400).json({ message: 'Token inválido ou expirado.' });
            }
            const dataExpired = new Date(user.resetPasswordExpires);
            const dataAtual = new Date();

            if(dataAtual > dataExpired) {
                return response.status(400).json({ message: 'Token expirado.' });
            }

            const senhaCryptografada = encryptPassword(senha);
            await prisma.user.update({
                where: {
                    id: user.id,
                },
                data: {
                    senha: senhaCryptografada,
                    resetPasswordToken: null,
                    resetPasswordExpires: null,
                },
            });

            return response.status(201).json({ message: 'Senha redefinida com sucesso.' });
        } catch (error) {
            return response.status(500).json({ message: 'Ocorreu um erro inesperado.' });
        }
    },

    async  listUsers(request: Request, response: Response) {
        try {
            const users = await prisma.user.findMany();
            return response.json(users);
        } catch (error) {
            return response.status(500).json({
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
            return response.status(500).json({
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
            return response.status(500).json({ error: error.message });
        }
    },

    async deleteUser(request: Request, response: Response) {
      try {
        const  { id } = request.params;
        
        const user = await prisma.user.findUnique({
          where: { id: String(id) },
        });

        if (!user) {
          return response.status(404).json({ error: 'Erro: Usuário não encontrado.' });
        }

        const userDeleted = await prisma.user.delete({
          where: {
            id: String(id)
          },
        });

        return response.status(200).json({
          message: 'Sucesso: Usuário deletado com sucesso!',
          userDeleted
        });

      } catch (error) {
        return response.status(500).json({ error: error.message });
      }
    }

};
