import {date, z} from 'zod';

export const FlightFilterSchema = z.object({
    min_fare: z.coerce.number().optional(),
    max_fare: z.coerce.number().optional(),
    date: date(),
    starting_airport: z.string(),
    destination_airport: z.string(),
    airline: z.array(z.string()).optional(),
    departure_time: z.string().optional(),
    duration: z.coerce.number().optional(),
    economy: z
    .string()
    .optional()
    .transform(val => {
        if (val === "true") return true;
        if (val === "false") return false;
        return undefined; // If the value is missing or invalid
    }),
    offset: z.coerce.number(), // Ensures offset is a number (coerced from string)
    limit: z.coerce.number().max(100), // Coerces and ensures max is 100
}).refine(data => data.min_fare === undefined || data.max_fare === undefined || data.min_fare <= data.max_fare, {
    message: "min_fare should be lesser than or equal to max_fare",
    path: ["min_fare"]
}); 

export type FlightFilter = z.infer<typeof FlightFilterSchema>;