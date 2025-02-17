import { Router } from 'express';
import { isAuth } from '@/api/middlewares/isAuth';

const route = Router();

route.get('/protected', isAuth, (req, res) => {
  res.json({ message: `Hello, ${(req as any).user.name}! You have access.` });
});

export default route;
