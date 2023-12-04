import request from 'supertest';
import { server } from '../../src/server';
import { prisma } from '../../src/database';

describe('POST /create', () => {
    let createdUserId: string;

    it('should create a new user and return a 201 status', async () => {
        const userData = {
            nome: 'Usuario Admin',
            email: 'teste1@example.com',
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
                email: 'teste1@example.com',
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

    it('should return a 400 status if password is missing or less than 8 characters', async () => {
        const userData = {
            nome: 'User With Invalid Password',
            email: 'invalidpassword@example.com',
            senha: 'pass',  // Password less than 8 characters
            documento: '46921264009',
            unidade_id: 'cfa19c26-3b18-4659-b02e-51047e5b3d13',
            cargos: ['USER'],
        };
    
        const response = await request(server)
            .post('/create')
            .send(userData);
    
        expect(response.status).toBe(400);
        expect(response.body.error).toBe(true);
        // eslint-disable-next-line quotes
        expect(response.body.message).toBe("Erro: senha deve ter no mínimo 8 caracteres!");
    });

    describe('POST /login', () => {
        let authToken: string;
    
        it('should log in a user and return a token', async () => {
            const userData = {
                email: 'teste1@example.com',
                senha: 'admin123@',
            };
    
            const response = await request(server)
                .post('/login')
                .send(userData);
    
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('token');
    
            // Armazenar o token para uso nos testes posteriores
            authToken = response.body.token;
        });
    
        it('should return a 401 status if email or senha is invalid', async () => {
            const userData = {
                email: 'asaas@admin.com',
                senha: 'WE@',
            };
    
            const response = await request(server)
                .post('/login')
                .send(userData);
    
            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty('message', 'E-mail ou senha inválidos');
        });
    
        describe('POST /change-password', () => {
            it('should update the user password and return a 200 status', async () => {
                // Certifique-se de que authToken está definido antes de executar este teste
                expect(authToken).toBeDefined();
    
                const novaSenhaData = {
                    novaSenha: 'novaSenha123@',
                    confirmacaoNovaSenha: 'novaSenha123@',
                };
    
                const response = await request(server)
                    .post('/change-password')
                    .set('Authorization', authToken)  // Usar o token obtido no login
                    .send(novaSenhaData);
    
                expect(response.status).toBe(200);
                expect(response.body).toHaveProperty('message', 'Senha atualizada com sucesso!');
                expect(response.body).toHaveProperty('userUpdated');
            });
    
            // Outros testes relacionados à mudança de senha aqui...
        });

        it('should return a 400 status if novaSenha and confirmacaoNovaSenha do not match', async () => {
            const token = 'token_valido_do_usuario';
    
            const novaSenhaData = {
                novaSenha: 'novaSenha123@',
                confirmacaoNovaSenha: 'senhaDiferente',
            };
    
            const response = await request(server)
                .post('/change-password')
                .set('Authorization', token)
                .send(novaSenhaData);
    
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message', 'Nova senha e confirmação da nova senha são obrigatórios.');
        });
    
        it('should return a 400 status if novaSenha or confirmacaoNovaSenha is missing', async () => {
            const token = 'token_valido_do_usuario';
    
            const novaSenhaData = {
                novaSenha: 'novaSenha123@',
                // confirmacaoNovaSenha is intentionally missing
            };
    
            const response = await request(server)
                .post('/change-password')
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
