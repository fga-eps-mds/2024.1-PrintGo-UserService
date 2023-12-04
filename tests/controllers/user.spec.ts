import request from 'supertest';
import { server } from '../../src/server';
import { prisma } from '../../src/database';

describe('POST /create', () => {
    let createdUserId: string;

    it('should create a new user and return a 201 status', async () => {
        const userData = {
            nome: 'Usuario Admin',
            email: 'ass@example.com',
            senha: 'admin123@',
            documento: '05699128140',
            unidade_id: '3dd05192-f770-40c3-80cd-c180208527c7',
            cargos: ['USER']
        };

        const response = await request(server)
            .post('/create')
            .send(userData);

        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Sucesso: Usuário cadastrado com sucesso!');
        expect(response.body.data).toHaveProperty('id');
        
        // Armazenar o ID do usuário criado para ser usado no teste posterior
        createdUserId = response.body.data.id;
    });

    it('should return a 400 status if email already exists', async () => {
        // Crie um usuário com o mesmo email antes de fazer a requisição
        await request(server)
            .post('/create')
            .send({
                nome: 'Existing User',
                email: 'test@example.com',
                senha: 'existingPassword',
                documento: '98765432109', // CPF ou CNPJ válido
                unidade_id: 'cfa19c26-3b18-4659-b02e-51047e5b3d13',
                cargos: ['USER'],
            });

        // Tente criar um novo usuário com o mesmo email
        const userData = {
            nome: 'Another User',
            email: 'ass@example.com',
            senha: 'newPassword',
            documento: '46921264009', // CPF ou CNPJ válido
            unidade_id: 'cfa19c26-3b18-4659-b02e-51047e5b3d13',
            cargos: ['USER'],
        };

        const response = await request(server)
            .post('/create')
            .send(userData);

        expect(response.status).toBe(400);
        expect(response.body.error).toBe(true);
        expect(response.body.message).toBe('Erro: Já existe usuário com esse email!');
    });

    describe('POST /login', () => {
        it('should log in a user and return a token', async () => {
            const userData = {
                email: 'as@example.com',
                senha: 'admin123@',
            };
    
            const response = await request(server)
                .post('/login')
                .send(userData);
    
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('token');
        });
    
        it('should return a 401 status if email or senha is invalid', async () => {
            const userData = {
                email: 'nonexistent@example.com',
                senha: 'invalidPassword',
            };
    
            const response = await request(server)
                .post('/login')
                .send(userData);
    
            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty('message', 'E-mail ou senha inválidos');
        });
    });
    
    describe('POST /mudancaSenha', () => {
        it('should update the user password and return a 200 status', async () => {
            // Você precisará implementar lógica para obter um token válido para um usuário existente.
            const token = 'token_valido_do_usuario';
    
            const novaSenhaData = {
                novaSenha: 'novaSenha123@',
                confirmacaoNovaSenha: 'novaSenha123@',
            };
    
            const response = await request(server)
                .post('/mudancaSenha')
                .set('Authorization', token)
                .send(novaSenhaData);
    
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('message', 'Senha atualizada com sucesso!');
            expect(response.body).toHaveProperty('userUpdated');
        });
    
        it('should return a 400 status if novaSenha and confirmacaoNovaSenha do not match', async () => {
            const token = 'token_valido_do_usuario';
    
            const novaSenhaData = {
                novaSenha: 'novaSenha123@',
                confirmacaoNovaSenha: 'senhaDiferente',
            };
    
            const response = await request(server)
                .post('/mudancaSenha')
                .set('Authorization', token)
                .send(novaSenhaData);
    
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message', 'Nova senha e confirmação da nova senha são obrigatórios.');
        });
    });

    // Limpeza: Remover o usuário de teste criado
    afterAll(async () => {
        if (createdUserId) {
            await prisma.user.delete({
                where: {
                    id: createdUserId,
                },
            });
        }
    });
});
