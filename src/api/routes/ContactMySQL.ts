import { Router, Request, Response, NextFunction } from 'express';
import middlewares from '../middlewares';
import { Container } from 'typedi';
import ContactMySQL  from '@/services/ContactMySQL';
const route = Router();

export default (app: Router) => {
  app.use('/contact', route);
  const contactSql = Container.get(ContactMySQL);

  route.get('/', async (req: Request, res: Response) =>{
    const dto = contactSql.GetContactDTO(req);
    const data = contactSql.getContact(dto);
    return res.status(200).json({ data });
  });

  route.get('/:email', async (req: Request, res: Response, next: NextFunction) => {
    const dto = contactSql.GetContactByMailDTO(req);
    const data = contactSql.getContactByMail(dto.email);
    if (!data) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    return res.json({ data }).status(201);
  });

  route.post('/', (req: any, res: Response, next: NextFunction) => {
    const dto = contactSql.createContactDTO(req);
    const data = contactSql.createContact(dto);
    return res.status(201).json({ data });
  });

  route.put('/:email', async (req: Request, res: Response, next: NextFunction) => {
    const dto = contactSql.updateContactDTO(req);
    const data = contactSql.updateContact(dto.email, dto);
      if (!data) {
        return res.status(404).json({ message: 'Contact not found' });
      }
      return res.status(200).json({ data });
  });

  route.delete('/:id', async(req: any, res: Response, net: NextFunction) =>{
    const dto = contactSql.DeleteContactDTO(req);
    const data = contactSql.deleteContact(dto.email, dto);
    res.status(204).json({message:"Contact deleted"});
  });

};