import { pool } from '../db';
import { Flight } from '../models/Flight';

export async function getFlightById(flightId: string): Promise<Flight> {
    try {
        const [rows]: [any, any] = await pool.query('SELECT * FROM flight WHERE flight_id = ?', [flightId]);
        return rows[0] as Flight;
    } catch (error) {
        throw error;
    }
}