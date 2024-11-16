import express from 'express';
import * as AirbnbController from '../controllers/airbnbController';

const router = express.Router();

router.get('/:id', AirbnbController.getById);

export default router;