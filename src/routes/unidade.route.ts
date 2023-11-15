import { Router } from 'express';
import UnidadeController from '../controllers/Unidade.controller';
import { requestHandler } from '../middlewares/requestWrapper.adapter';

const unidadeRoutes = Router();
unidadeRoutes.post('/create', requestHandler(UnidadeController.createUnidade));
unidadeRoutes.get('/', requestHandler(UnidadeController.listUnidades));
unidadeRoutes.get('/:id', requestHandler(UnidadeController.getUnidadeById));

export default unidadeRoutes;