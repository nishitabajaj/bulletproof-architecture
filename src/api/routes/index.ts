import { Router } from 'express';
import protectedRoute from './protected';

const route = Router();

export default (app: Router) => {
  app.use('/protected', protectedRoute);
};