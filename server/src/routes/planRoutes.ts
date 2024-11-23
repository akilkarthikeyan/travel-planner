import express from 'express';
import * as PlanController from '../controllers/planController';

const router = express.Router();

router.get('/:id', PlanController.getDetailsById);

export default router;