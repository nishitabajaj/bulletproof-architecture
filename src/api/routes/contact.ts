import { Router, Request, Response, NextFunction } from 'express';
import middlewares from '../middlewares';
import { Container } from 'typedi';
import ContactService from '@/services/contact';
const route = Router();

export default (app: Router) => {
  app.use('/contact', route);
  const contactService = Container.get(ContactService);

  route.get('/', 
            middlewares.isAuth, 
            middlewares.attachCurrentUser, 
            async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto = contactService.contactGetDto(req);
        const contacts = contactService.getContact(dto); // Fetch all contacts
        return res.status(200).json({ success: true, data: contacts });
    } catch (error) {
        console.error('❌ Error fetching contacts:', error.message);
        return res.status(500).json({ success: false, message: error.message });
    }
});

  route.post('/', async (req: any, res: Response, next: NextFunction) => {
    try {
        const dto = contactService.contactCreateDto(req);
        const data = await contactService.contactCreate(dto); // Await MongoDB Save
        return res.status(201).json({ success: true, data });
    } catch (error) {
        console.error('❌ Error:', error.message);
        return res.status(500).json({ success: false, message: error.message });
    }
});


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

  route.delete('/', async (req: any, res: Response, next: NextFunction) => {
    try {
        const dto = contactService.DeleteContactDTO(req); // Get email from body
        await contactService.deleteContact(dto.email); // Pass email
        res.status(200).json({ message: "Contact deleted" });
    } catch (error) {
        next(error);
    }
});
};

//http://localhost:3000/api/contact