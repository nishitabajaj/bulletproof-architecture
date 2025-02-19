import jwt from 'jsonwebtoken';
import config from '@/config';
import { Request, Response, NextFunction } from 'express';

interface CustomJwtPayload extends jwt.JwtPayload {
  _id: string;
  role: string;
  name: string;}

export const isAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: No Token Provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, config.jwtSecret) as CustomJwtPayload;
    console.log(decoded);

    if (!decoded || !decoded._id) {
      return res.status(401).json({ message: "Unauthorized: Invalid Token" });
    }

    // Attach the user information to the request
    (req as any).currentUser = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized: Invalid Token" });
  }
};

 export default isAuth;