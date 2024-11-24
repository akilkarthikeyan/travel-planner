import express from 'express';
import * as PlanController from '../controllers/planController';

const router = express.Router();

router.get('/:id', PlanController.getById);
router.post('/', PlanController.createPlan);
router.delete('/:id', PlanController.deletePlan);
router.put('/:id', PlanController.updatePlan);

export default router;