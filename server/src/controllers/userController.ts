import { Request, Response } from 'express';
// import { UserService } from '../services/userService';

export async function createUser(req: Request, res: Response): Promise<void> {
  try {
    // const user = await UserService.registerUser(req.body);
    res.status(201).json({
        message: 'User registered successfully',
        // user,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error });
  }
}