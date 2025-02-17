import { Router, Request, Response } from 'express';
const route = Router();

route.get('/ping', (req: Request, res: Response) => {
  res.json({ message: "Server is running!" });
});

export default (app: Router) => {
  app.use('/', route);
};
