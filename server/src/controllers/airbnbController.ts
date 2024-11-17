import { Request, Response } from 'express';
import * as AirbnbService from '../services/airbnbService';
import { Airbnb, AirbnbSchema } from '../models/Airbnb';

export async function getById(req: Request, res: Response): Promise<void> {
  try {
    const airbnbId = Number(req.params.id);
    // validate
    if (!airbnbId || isNaN(airbnbId)) {
      res.status(400).json({ message: 'Airbnb ID is required' });
      return;
    }
    const airbnb = await AirbnbService.getAirbnbById(airbnbId);
    if (airbnb) {
      res.status(200).json({
        message: 'Airbnb fetched successfully',
        data: airbnb
      });
    } else {
      res.status(404).json({ message: 'Airbnb not found' });
    }
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ message: 'An unexpected error occurred' });
  }
}