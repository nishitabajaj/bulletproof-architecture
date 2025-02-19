import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import UserModel from '@/models/user'; // Import the User model
import config from '@/config'; // Assuming jwtSecret is in config
import { IUser } from '@/interfaces/IUser';

const route = Router();

export default (app: Router) => {
  app.use('/users', route);

  // Route to get all users with their tokens
  route.get('/all', async (req: Request, res: Response) => {
    try {
      const users = await UserModel.find(); // Fetch all users from MongoDB

      const usersWithTokens = users.map((user: IUser & mongoose.Document) => {
        // Generate a JWT token for each user
        const token = jwt.sign({ _id: user._id }, config.jwtSecret, { expiresIn: '1h' });

        return {
          user: {
            _id: user._id,
            name: user.name,
            phone: user.phone,
            email: user.email,
            role: user.role, // Now recognized by TypeScript
          },
          token, // Add the generated token for each user
        };
      });

      return res.status(200).json({ users: usersWithTokens });
    } catch (error) {
      return res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
  });

  // Route to get current user info
  route.get('/me', async (req: Request, res: Response) => {
    try {
      const userRecord = req.currentUser as IUser; // Typecast to IUser
      if (!userRecord) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      return res.json({ user: userRecord }).status(200);
    } catch (error) {
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  });
};