import { pool } from '../db';
import { Airbnb } from '../models/Airbnb';

export async function getAirbnbById(airbnbId: number): Promise<Airbnb> {
    try {
        const [rows]: [any, any] = await pool.query('SELECT * FROM airbnb WHERE airbnb_id = ?', [airbnbId]);
        return rows[0] as Airbnb;
    } catch (error) {
        throw error;
    }
}