import { Request, Response } from 'express';
import * as UserService from '../services/userService';
import * as PlanService from '../services/planService';
import { User, UserSchema } from '../models/User';

export async function getAll(req: Request, res: Response): Promise<Response> {
  try {
    const users = await UserService.getAllUsers();
    return res.status(200).json({
      message: 'Users fetched successfully',
      data: users
    });
  } catch (error: any) {
    console.log(error.message);
    return res.status(500).json({ message: 'An unexpected error occurred' });
  }
}

export async function getById(req: Request, res: Response): Promise<Response> {
  try {
    const userId = Number(req.params.id);
    // validate
    if (!userId || isNaN(userId)) {
      return res.status(400).json({ message: 'User ID is required' });
    }
    const user = await UserService.getUserById(userId);
    if (user) {
      return res.status(200).json({
        message: 'User fetched successfully',
        data: user
      });
    } else {
      return res.status(404).json({ message: 'User not found' });
    }
  } catch (error: any) {
    console.log(error.message);
    return res.status(500).json({ message: 'An unexpected error occurred' });
  }
}

export async function getPlansById(req: Request, res: Response): Promise<Response> {
  // validate
  try {
    const userId = Number(req.params.id);
    if (!userId || isNaN(userId)) {
      return res.status(400).json({ message: 'User ID is required' });
    }
    const plans = await PlanService.getPlansByUserId(userId);
    return res.status(200).json({
      message: 'Plans fetched successfully',
      data: plans
    });
  } catch (error: any) {
    console.log(error.message);
    return res.status(500).json({ message: 'An unexpected error occurred' });
  }
}

export async function create(req: Request, res: Response): Promise<void> {
  // validate
  let user: User;
  try {
    user = UserSchema.parse(req.body);
  } catch (error: any) {
    console.log("User validation errors: ", error.errors.map((err: any) => err.message + ' at ' + err.path.join('.')));
    res.status(400).json({ message: 'Invalid user data' });
    return;
  }
  try {
    const newUser = await UserService.createUser(user);
    res.status(201).json({
      message: 'User created successfully',
      data: newUser
    });
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ message: 'An unexpected error occurred' });
  }
}