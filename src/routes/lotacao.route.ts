import { Router } from 'express';
import LotacaoController from '../controllers/Lotacao.controller';
import { requestHandler } from '../middlewares/requestWrapper.adapter';

const lotacaoRoutes = Router();
lotacaoRoutes.post('/create', requestHandler(LotacaoController.createLotacao));
lotacaoRoutes.get('/', requestHandler(LotacaoController.listLotacoes));
lotacaoRoutes.get('/:id', requestHandler(LotacaoController.getLotacaoById));

export default lotacaoRoutes;