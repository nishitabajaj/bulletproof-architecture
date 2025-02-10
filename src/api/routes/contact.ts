import { Router, Request, Response, NextFunction } from 'express';
import middlewares from '../middlewares';
import { Container } from 'typedi';
import ContactService from '@/services/contact';
const route = Router();

export default (app: Router) => {
  app.use('/contact', route);
  const contactService = Container.get(ContactService);
  route.get('/', middlewares.isAuth, middlewares.attachCurrentUser, (req: Request, res: Response) => {
    return res.json({ user: req.currentUser }).status(200);
  });

  route.post('/', async (req: any, res: Response, next: NextFunction) => {
    
    const dto = contactService.contactCreateDto(req)
    const data = contactService.contactCreate(dto)
    return res.json({ data }).status(201)
  })

  route.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
      
      const contactId = req.params.id;
      const updateDto = contactService.contactUpdateDto(req);
  
      const updatedContact = await contactService.contactUpdate(contactId, updateDto);
  
      if (!updatedContact) {
        return res.status(404).json({ message: 'Contact not found' });
      }
      return res.status(200).json({ updatedContact });
    } catch (error) {
      next(error);
    }
  });
     
  };
