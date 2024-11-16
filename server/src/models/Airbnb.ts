import { z } from "zod";

export const AirbnbSchema = z.object({
    airbnb_id: z.number().int(),
    listing_url: z.string().optional(),
    name: z.string().optional(),
    description: z.string().optional(),
    neighborhood_overview: z.string().optional(),
    picture_url: z.string().optional(),
    latitude: z.number(),
    longitude: z.number(),
    property_type: z.string().optional(),
    accommodates: z.number().optional(),
    bathrooms: z.number().optional(),
    bedrooms: z.number().optional(),
    beds: z.number().optional(),
    amenities: z.array(z.any()).optional(),
    price: z.number(),
    number_of_reviews: z.number().optional(),
    review_scores_rating: z.number(),
    close_to_airport: z.string(),
    host_id: z.number().int(),
});

export type Airbnb = z.infer<typeof AirbnbSchema>;