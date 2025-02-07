import { Router, Request, Response, NextFunction } from 'express';
import middlewares from '../middlewares';
import { Container } from 'typedi';
import ContactMySQL  from '@/services/ContactMySQL';
const route = Router();

export default (app: Router) => {
  app.use('/contact', route);
  const contactSql = Container.get(ContactMySQL);
  route.get('/', middlewares.isAuth, middlewares.attachCurrentUser, async (req: Request, res: Response) =>{
    const retrieveContact = Container.get(ContactMySQL);
    return res.status(200).json({user: req.currentUser});
  });

  route.get('/:email', middlewares.isAuth, middlewares.attachCurrentUser, async (req: Request, res: Response) => {
    const email = req.query.email as string;
    if (!email) {
      return res.status(400).json({ error: 'Email parameter is required' });
    }
    
    const contact = await contactSql.getContactByMail(email);
    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    return res.status(200).json({ contact });
  });

  route.post('/', (req: any, res: Response, next: NextFunction) => {
    const dto = contactSql.createContactDTO(req);
    const data = contactSql.createContact(req.body);
    return res.status(201).json({ data });
  });

  route.put('/:email', async (req: Request, res: Response, next: NextFunction) => {
    const updatedContact=await contactSql.updateContact(req.params.id, req.body);
    return res.status(200).json({contact: updatedContact});
  });

  route.delete('/:id', async(req: any, res: Response, net: NextFunction) =>{
    const contactSQL = Container.get(ContactMySQL);
    const removeContact = await contactSql.deleteContact(req.params.id, req.body);
    res.status(204).json({message:"Contact deleted"});
  });

};