import { z } from 'zod';

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

export enum SegmentTypeEnum {
    AIRBNB = 'airbnb',
    FLIGHT = 'flight',
}

export const SegmentSchema = z.object({
    plan_id: z.number(),
    segment_type: z.nativeEnum(SegmentTypeEnum),
    segment_id: z.string().optional(),
    ordinal: z.number().optional(),
    start_date: z.string().refine(val => dateRegex.test(val), {
        message: 'Start date must be in YYYY-MM-DD format',
    }).optional(),
    end_date: z.string().refine(val => dateRegex.test(val), {
        message: 'End date must be in YYYY-MM-DD format',
    }).optional(),
});

export type Segment = z.infer<typeof SegmentSchema>;