import { Router, Request, Response } from 'express';
import middlewares from '../middlewares';
const route = Router();

export default (app: Router) => {
  app.use('/users', route);

  route.get('/me', (req: Request, res: Response) => {
    return res.json({ user: 'hello' }).status(200);
  });
};
