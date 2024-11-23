import { pool } from '../db';
import { Flight } from '../models/Flight';

export async function getFlightById(flightId: string): Promise<Flight> {
    try {
        const [rows] = await pool.query('SELECT * FROM flight WHERE flight_id = ?', [flightId]);
        const flights = rows as Flight[];
        return flights[0] || null;
    } catch (error) {
        throw error;
    }
}

// TODO: Finish this up broski
export async function getAllFlights(): Promise<Flight[]> {
    try {
        const [rows] = await pool.query('SELECT * FROM flight');
        return rows as Flight[];
    } catch (error) {
        throw error;
    }
}