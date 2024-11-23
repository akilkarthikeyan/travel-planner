import {z} from 'zod';

export const AirbnbFilterSchema = z.object({
    min_price: z.number().optional(),
    max_price: z.number().optional(),
    close_to_airport: z.string(),
    accomodates: z.number().optional(),
    rating: z.number().optional(),
    superhost: z.boolean().optional()
}); 