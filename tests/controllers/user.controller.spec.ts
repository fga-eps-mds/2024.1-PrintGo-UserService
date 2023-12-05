import request from 'supertest';
import { server } from '../../src/server';
import { prisma } from '../../src/database';
import UserController from '../../src/controllers/User.controller';

describe('User Controller', () => {
    let user_created_id: string;
    let authToken: string;
    const defaultEmail = `teste${Date.now()}@example.com`;
    const defaultPass = 'admin123@';
    const defaultUnit= '3dd05192-f770-40c3-80cd-c180208527c7';

    afterAll(async () => {
        await server.close();
        if (user_created_id) {
            await prisma.user.delete({
                where: {
                    id: user_created_id,
                },
            });
        }
    });

    it('should create a new user and return a 201 status', async () => {
        const userData = {
            nome: 'Usuario Admin',
            email: defaultEmail,
            senha: defaultPass,
            documento: '05699128140',
            unidade_id: defaultUnit,
            cargos: ['USER']
        };

        const response = await request(server)
            .post('/create')
            .send(userData);

        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Sucesso: Usuário cadastrado com sucesso!');
        expect(response.body.data).toHaveProperty('id');
        user_created_id = response.body.data.id;
    });


    it('should return a 400 status if email already exists', async () => {
        await request(server)
            .post('/create')
            .send({
                nome: 'Existing User',
                email: defaultEmail,
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
    //Login

    it('should log in a user and return a token', async () => {
        const userData = {
            email: defaultEmail,
            senha: defaultPass,
        };

        const response = await request(server)
            .post('/login')
            .send(userData);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('token');

        authToken = response.body.token;
    });

    it('should return a 401 status if email or senha is invalid', async () => {
        const userData = {
            email: defaultEmail,
            senha: 'wrongPassword',
        };

        const response = await request(server)
            .post('/login')
            .send(userData);

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('message', 'E-mail ou senha inválidos');
    });

    it('should update the user password and return a 200 status', async () => {
        expect(authToken).toBeDefined();

        const novaSenhaData = {
            novaSenha: 'novaSenha123@',
            confirmacaoNovaSenha: 'novaSenha123@',
        };

        const response = await request(server)
            .post('/change-password')
            .set('Authorization', authToken)
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
        };

        const response = await request(server)
            .post('/change-password')
            .set('Authorization', token)
            .send(novaSenhaData);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message', 'Nova senha e confirmação da nova senha são obrigatórios.');
    });

    it('GET USERBY ID', async () => {
        const response = await request(server)
            .get(`/${user_created_id}`);

        expect(response.status).toBe(200);
        expect(response.body.email).toBe(defaultEmail);
    });

    it('GET USERBY ID Fail', async () => {
        const response = await request(server)
            .get(`/${user_created_id}1234`);

        expect(response.status).toBe(404);
        expect(response.body.error).toBe(true);
        expect(response.body.message).toBe('Erro: Não foi possível encontrar o usuario.');
    });

    // Gest User
    it('should return a  of users and a 200 status', async () => {
        const response = await request(server)
            .get('/');

        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
    });

    it('should return a 500 status and an error message on database error', async () => {
        // Mocking a database error by causing an invalid query
        jest.spyOn(prisma.user, 'findMany').mockImplementationOnce(() => {
            throw new Error('Database error');
        });

        const response = await request(server)
            .get('/');

        expect(response.status).toBe(500);
        expect(response.body).toHaveProperty('error', true);
        expect(response.body).toHaveProperty('message', 'Erro: Ocorreu um erro ao buscar os Usuarios.');

        jest.restoreAllMocks();
    });

    it('update user wrong document', async () => {
        const response = await request(server)
            .patch(`/${user_created_id}`)
            .send({
                nome: 'Existing1 User',
                documento: '05699128141',
            });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Erro: CPF ou CNPJ inválido!');
    });

    it('update user wrong user id', async () => {
        const response = await request(server)
            .patch(`/${user_created_id}1234`)
            .send({
                nome: 'Existing1 User',
                documento: '05699128140',
            });

        expect(response.status).toBe(404);
        // expect(response.body.message).toBe('Erro: Usuário não encontrado.');
    });

    it('should update user', async () => {
        const response = await request(server)
            .patch(`/${user_created_id}`)
            .send({
                nome: 'Existing1 User',
                documento: '05699128140',
            });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Sucesso: Usuário atualizado com sucesso!');
    });

});
