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
}).refine(data => {
    if (data.segment_type === SegmentTypeEnum.FLIGHT) {
        return !data.start_date && !data.end_date;
    }
    if (data.segment_type === SegmentTypeEnum.AIRBNB) {
        return !!data.start_date && !!data.end_date;
    }
    return true;
}, {
    message: 'start_date and end_date required for airbnb segments and not allowed for flight segments',
    path: ['start_date', 'end_date'],
}).refine(data => {
    if (data.start_date && data.end_date) {
        return new Date(data.start_date) < new Date(data.end_date);
    }
    return true;
}, {
    message: 'end_date must be after start_date',
    path: ['end_date'],
});

export type Segment = z.infer<typeof SegmentSchema>;