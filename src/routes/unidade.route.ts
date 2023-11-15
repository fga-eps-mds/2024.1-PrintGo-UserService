import { Router } from 'express';
import LotacaoController from '../controllers/Unidade.controller';
import { requestHandler } from '../middlewares/requestWrapper.adapter';

const unidadeRoutes = Router();
unidadeRoutes.post('/create', requestHandler(LotacaoController.createUnidade));
unidadeRoutes.get('/', requestHandler(LotacaoController.listUnidades));
unidadeRoutes.get('/:id', requestHandler(LotacaoController.getUnidadeById));

export default unidadeRoutes;