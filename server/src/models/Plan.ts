import { z } from 'zod';

export const PlanSchema = z.object({
    plan_id: z.number().optional(),
    plan_name: z.string(),
    plan_description: z.string().optional()
});

export type Plan = z.infer<typeof PlanSchema>;