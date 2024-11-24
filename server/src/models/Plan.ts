import { z } from 'zod';
import { SegmentSchema } from './Segment';

export const PlanSchema = z.object({
    plan_id: z.number().optional(),
    plan_name: z.string(),
    plan_description: z.string().optional(),
    segments: z.array(SegmentSchema),
});

export type Plan = z.infer<typeof PlanSchema>;