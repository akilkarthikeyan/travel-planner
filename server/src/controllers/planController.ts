import { Request, Response } from 'express';
import * as PlanService from '../services/planService';
import { Plan, PlanSchema } from '../models/Plan';

export async function getById(req: Request, res: Response): Promise<Response> {
  try {
    const planId = Number(req.params.id);
    // validate
    if (!planId || isNaN(planId)) {
      return res.status(400).json({ message: 'Plan ID is required' });
    }
    const plan = await PlanService.getPlanById(planId);
    if (plan) {
      return res.status(200).json({
        message: 'Plan fetched successfully',
        data: plan
      });
    } else {
      return res.status(404).json({ message: 'Plan not found' });
    }
  } catch (error: any) {
    console.log(error.message);
    return res.status(500).json({ message: 'An unexpected error occurred' });
  }
}