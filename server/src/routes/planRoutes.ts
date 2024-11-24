import express from 'express';
import * as PlanController from '../controllers/planController';

const router = express.Router();

router.get('/:id', PlanController.getById);
router.post('/', PlanController.createPlan);

export default router;