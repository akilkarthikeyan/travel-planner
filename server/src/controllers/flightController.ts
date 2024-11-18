import { Request, Response } from 'express';
import * as FlightService from '../services/flightService';
import { Flight, FlightSchema } from '../models/Flight';

export async function getById(req: Request, res: Response): Promise<void> {
  try {
    const flightId = req.params.id;
    // validate
    if (!flightId) {
      res.status(400).json({ message: 'Flight ID is required' });
      return;
    }
    const flight = await FlightService.getFlightById(flightId);
    if (flight) {
      res.status(200).json({
        message: 'Flight fetched successfully',
        data: flight
      });
      return;
    } else {
      res.status(404).json({ message: 'Flight not found' });
      return;
    }
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ message: 'An unexpected error occurred' });
    return;
  }
}

// TODO: Add filter function for flights - by date, by airport, by airline, by fare, by duration