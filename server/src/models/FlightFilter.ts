import {z} from 'zod';

export const FlightFilterSchema = z.object({
    min_fare: z.number().optional(),
    max_fare: z.number().optional(),
    starting_airport: z.string(),
    destination_airport: z.string(),
    airline: z.array(z.string()).optional(),
    departure_time: z.string().optional(),
    duration: z.number().optional(),
    economy: z.boolean().optional()
}); 

