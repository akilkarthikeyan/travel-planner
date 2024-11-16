import express from 'express';
import * as PlanController from '../controllers/planController';

const router = express.Router();

router.get('/:id', PlanController.getById);

export default router;