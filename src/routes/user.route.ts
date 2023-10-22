import { Router } from 'express';
import UserController from '../controllers/User.controller';

const userRoutes = Router();

userRoutes.post('/create', UserController.createUser);
userRoutes.get('/', UserController.listUsers);
userRoutes.get('/:id', UserController.getUserById);
userRoutes.patch('/:id', UserController.updateUser);
userRoutes.post('/login', UserController.login);

export default userRoutes;