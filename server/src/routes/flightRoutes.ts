import express from 'express';
import * as FlightController from '../controllers/flightController';

const router = express.Router();

router.get('/:id', FlightController.getById);

export default router;