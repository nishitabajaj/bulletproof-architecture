import { Router, Request, Response, NextFunction } from 'express';
import middlewares from '../middlewares';
import { Container } from 'typedi';
import ContactMySQL from '@/services/ContactMySQL';
const route = Router();

export default (app: Router) => {
  app.use('/contact', route);

  route.get('/', middlewares.isAuth, middlewares.attachCurrentUser, async (req: Request, res: Response) =>{
    const retrieveContact = Container.get(ContactMySQL);
    const printContact = await retrieveContact.getContact();
    return res.status(200).json({contact: printContact});
  }
  )

  route.get('/', middlewares.isAuth, middlewares.attachCurrentUser, async (req: Request, res: Response) => {
    const email = req.query.email as string;
    if (!email) {
      return res.status(400).json({ error: 'Email parameter is required' });
    }
    const contactSql = Container.get(ContactMySQL);
    const contact = await contactSql.getContactByMail(email);
    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    return res.status(200).json({ contact });
  });

  route.post('/', async (req: any, res: Response, next: NextFunction) => {
    const Contactsql = Container.get(ContactMySQL);
    const newContact = await Contactsql.createContact(req.body);
    return res.status(201).json({contact: newContact});
  })

  route.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
    const contactSQL = Container.get(ContactMySQL);
    const updatedContact=await contactSQL.updateContact(req.params.id, req.body);
    return res.status(200).json({contact: updatedContact});
  })

  route.delete('/:id', async(req: any, res: Response, net: NextFunction) =>{
    const contactSQL = Container.get(ContactMySQL);
    const removeContact = await contactSQL.deleteContact(req.params.id);
    res.status(204).json({message:"Contact deleted"});

  });

};