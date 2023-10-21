import { Router } from 'express';
import UserController from '../controllers/User.controller';

const userRoutes = Router();

userRoutes.post('/create', UserController.createUser);

export default userRoutes;