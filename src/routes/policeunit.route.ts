import { Router } from 'express';
import { requestHandler } from '../middlewares/requestWrapper.adapter';
import PoliceUnitController from '../controllers/PoliceUnit.controller';

const PoliceUnitRoutes = Router();
PoliceUnitRoutes.post('/create', requestHandler(PoliceUnitController.createPoliceUnit));

export default PoliceUnitRoutes;