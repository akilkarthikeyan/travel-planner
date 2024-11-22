import { pool } from '../db';
import { User } from '../models/User';

export async function getAllUsers(): Promise<User[]> {
  try {
    const [rows] = await pool.query('SELECT * FROM user');
    return rows as User[];
  } catch (error) {
    throw error;
  }
}

export async function getUserById(userId: number): Promise<User> {
  try {
    const [rows]: [any, any] = await pool.query('SELECT * FROM user WHERE user_id = ?', [userId]);
    return rows[0] as User;
  } catch (error) {
    throw error;
  }
}

export async function createUser(user: User): Promise<User> {
  try {
    const query = `INSERT INTO user (user_name, phone, email) VALUES (?, ?, ?)`;
    const [result]: [any, any] = await pool.query(query, [user.user_name, user.phone || null, user.email || null]);
    return getUserById(result.insertId);
  } catch (error) {
    throw error;
  }
}