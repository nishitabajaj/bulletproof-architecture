import { Container } from 'typedi';
import jwt from 'jsonwebtoken';
import config from '@/config';
import mongoose from 'mongoose';
import { Request, Response, NextFunction } from 'express';
import { IUser } from '@/interfaces/IUser';
import { Logger } from 'winston';

const attachCurrentUser = async (req: Request, res: Response, next: NextFunction) => {
  const Logger: Logger = Container.get('logger');

  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }
    
    const token = authHeader.split(' ')[1]; // Extract token value

    // Verify token
    const decoded = jwt.verify(token, config.jwtSecret) as { _id: string };
    if (!decoded || !decoded._id) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    // Fetch user from MongoDB
    const UserModel = Container.get('userModel') as mongoose.Model<IUser & mongoose.Document>;
    const userRecord = await UserModel.findById(decoded._id);

    if (!userRecord) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Convert user document to object & remove sensitive fields
    const currentUser = userRecord.toObject();
    Reflect.deleteProperty(currentUser, 'password');
    Reflect.deleteProperty(currentUser, 'salt');

    // Attach user to request
    req.currentUser = currentUser;
    return next();

  } catch (error) {
    Logger.error('🔥 Error attaching user to req: %o', error);
    return res.status(401).json({ message: 'Unauthorized', error: error.message });
  }
};

export default attachCurrentUser;