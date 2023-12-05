import { Router } from 'express';
import UserController from '../controllers/User.controller';
import { requestHandler } from '../middlewares/requestWrapper.adapter';

const userRoutes = Router();

userRoutes.post('/create', requestHandler(UserController.createUser));
userRoutes.get('/', requestHandler(UserController.listUsers));
userRoutes.get('/:id', requestHandler(UserController.getUserById));
userRoutes.patch('/:id', requestHandler(UserController.updateUser));
userRoutes.post('/change-password', requestHandler(UserController.mudancaSenha));
userRoutes.post('/login', requestHandler(UserController.login));
userRoutes.post('/forgotten-password', requestHandler(UserController.esqueciSenha));
userRoutes.post('/recover-password', requestHandler(UserController.resetPassword));
export default userRoutes;