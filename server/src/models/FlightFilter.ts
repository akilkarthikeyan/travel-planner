import {z} from 'zod';

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;
const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

export const FlightFilterSchema = z.object({
    min_fare: z.coerce.number().optional(),
    max_fare: z.coerce.number().optional(),
    date: z.string().refine(val => dateRegex.test(val), {
        message: "Invalid date format, should be yyyy-mm-dd",
        path: ["date"]
    }),
    starting_airport: z.string(),
    destination_airport: z.string(),
    airline: z.string().optional(),
    departure_time_from: z.string().optional().refine(val => val === undefined || timeRegex.test(val), {
        message: "Invalid time format, should be hh-mm-ss",
        path: ["departure_time_from"]
    }),
    departure_time_to: z.string().optional().refine(val => val === undefined || timeRegex.test(val), {
        message: "Invalid time format, should be hh-mm-ss",
        path: ["departure_time_to"]
    }),
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
}).refine(data => data.departure_time_from === undefined || data.departure_time_to === undefined || data.departure_time_from <= data.departure_time_to, {
    message: "departure_time_from should be lesser than or equal to departure_time_to",
    path: ["departure_time_from"]   
});

export type FlightFilter = z.infer<typeof FlightFilterSchema>;