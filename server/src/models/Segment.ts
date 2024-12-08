import { z } from 'zod';
import { isValidDate } from '../utils/dateUtils';

export enum SegmentTypeEnum {
    AIRBNB = 'airbnb',
    FLIGHT = 'flight',
}

export const SegmentSchema = z.object({
    plan_id: z.number().optional(),
    segment_type: z.nativeEnum(SegmentTypeEnum),
    segment_id: z.string(),
    ordinal: z.number().optional(),
    start_date: z.string().refine(val => isValidDate(val), {
        message: 'Start date must be a valid date in YYYY-MM-DD format',
        path: ['start_date']
    }).optional(),
    end_date: z.string().refine(val => isValidDate(val), {
        message: 'End date must be a valid date in YYYY-MM-DD format',
        path: ['end_date']
    }).optional(),
});

export type Segment = z.infer<typeof SegmentSchema>;