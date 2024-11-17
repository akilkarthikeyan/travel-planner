import { z } from 'zod';

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

export const FlightSchema = z.object({
    flight_id: z.string(),
    flight_date: z.string().regex(dateRegex),
    starting_airport: z.string(),
    destination_airport: z.string(),
    travel_duration: z.number().optional(),
    is_basic_economy: z.boolean().optional(),
    total_fare: z.number().min(0).max(99999999.99), 
    departure_time: z.string().regex(/^\d{2}:\d{2}:\d{2}$/),
    arrival_time: z.string().regex(/^\d{2}:\d{2}:\d{2}$/),
    equipment_description: z.string(),
    airline_id: z.string().length(2),
});

export type Flight = z.infer<typeof FlightSchema>;