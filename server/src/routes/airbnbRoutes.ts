import express from 'express';
import * as AirbnbController from '../controllers/airbnbController';

const router = express.Router();

router.get('/:id', AirbnbController.getById);
router.get('/', AirbnbController.getAll);

export default router;