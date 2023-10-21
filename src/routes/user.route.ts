import { Router } from 'express';
import UserController from '../controllers/User.controller';

const userRoutes = Router();

userRoutes.post('/create', UserController.createUser);
userRoutes.get('/', UserController.listUsers);
userRoutes.get('/:id', UserController.getUserById);


export default userRoutes;