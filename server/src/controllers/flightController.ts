import { Request, Response } from 'express';
import * as FlightService from '../services/flightService';
import { Flight, FlightSchema } from '../models/Flight';

export async function getById(req: Request, res: Response): Promise<Response> {
  try {
    const flightId = req.params.id;
    // validate
    if (!flightId) {
      return res.status(400).json({ message: 'Flight ID is required' });
    }
    const flight = await FlightService.getFlightById(flightId);
    if (flight) {
      return res.status(200).json({
        message: 'Flight fetched successfully',
        data: flight
      });
    } else {
      return res.status(404).json({ message: 'Flight not found' });
    }
  } catch (error: any) {
    console.log(error.message);
    return res.status(500).json({ message: 'An unexpected error occurred' });
  }
}