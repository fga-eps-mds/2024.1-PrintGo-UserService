import { Router } from 'express';
import LotacaoController from '../controllers/Lotacao.controller';

const lotacaoRoutes = Router();

lotacaoRoutes.post('/create', LotacaoController.createLotacao);
lotacaoRoutes.get('/', LotacaoController.listLotacoes);
lotacaoRoutes.get('/:id', LotacaoController.getLotacaoById);

export default lotacaoRoutes;