import { Request, Response } from 'express';
import * as PlanService from '../services/planService';
import { Plan, PlanSchema} from '../models/Plan';

export async function getById(req: Request, res: Response): Promise<void> {
  try {
    const planId = Number(req.params.id);
    // validate
    if (!planId || isNaN(planId)) {
      res.status(400).json({ message: 'Plan ID is required' });
      return;
    }
    const plan = await PlanService.getPlanById(planId);
    if (plan) {
      res.status(200).json({
        message: 'Plan Details fetched successfully',
        data: plan
      });
      return;
    } else {
      res.status(404).json({ message: 'Plan not found' });
      return;
    }
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ message: 'An unexpected error occurred' });
    return;
  }
}

export async function createPlan(req: Request, res: Response): Promise<void> {
  let plan: Plan;
  // validate
  try {
    plan = PlanSchema.parse(req.body);
  } catch (error: any) {
    console.log("Plan validation errors: ", error.errors.map((err: any) => err.message + ' at ' + err.path.join('.')));
    res.status(400).json({ message: 'Invalid plan data' });
    return;
  }
  try {
    const newPlan = await PlanService.createPlan(plan, 1);
    res.status(201).json({
      message: 'Plan created successfully',
      data: newPlan
    });
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ message: 'An unexpected error occurred' });
    return;
  }
}