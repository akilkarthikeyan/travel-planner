import { Request, Response } from 'express';
import * as UserService from '../services/userService';
import { User, UserSchema } from '../models/User';

export async function getAll(req: Request, res: Response): Promise<void> {
  try {
    const users = await UserService.getAllUsers();
    res.status(200).json({
      message: 'Users fetched successfully',
      data: users
    });
  } catch (error) {
    res.status(500);
  }
}

export async function getById(req: Request, res: Response): Promise<void> {
  try {
    const userId = Number(req.params.id);
    // validate
    if (!userId || isNaN(userId)) {
      res.status(400).json({ message: 'User ID is required' });
      return;
    }
    const user = await UserService.getUserById(userId);
    if (user) {
      res.status(200).json({
        message: 'User fetched successfully',
        data: user
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500);
  }
}

export async function create(req: Request, res: Response): Promise<void> {
  // validate
  try {
    var user = UserSchema.parse(req.body);
  } catch (error) {
    res.status(400).json({ message: 'Invalid user data' });
    return;
  }
  try {
    const newUser = await UserService.createUser(user);
    res.status(201).json({
      message: 'User created successfully',
      data: newUser
    });
  } catch (error) {
    res.status(500);
  }
}