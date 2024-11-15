import express, { Request, Response } from 'express';
import cors from 'cors';
import userRoutes from './routes/userRoutes';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req: Request, res: Response) => {
  res.send('Server is running');
});

// User routes
app.use('/users', userRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});