import { Router, Request, Response, NextFunction } from 'express';
import middlewares from '../middlewares';
import { Container } from 'typedi';
import ContactMySQL  from '@/services/ContactMySQL';

const route = Router();

export default (app: Router) => {
  app.use('/contactsql', route);
  const contactSql = Container.get(ContactMySQL);

  route.get('/:id',  async (req: Request, res: Response) =>{
    const dto = contactSql.GetContactDTO(req);
    const data = contactSql.getContact(dto);
    return res.status(200).json({ data });
  });

  // route.get('/:email', async (req: Request, res: Response, next: NextFunction) => {
  //   const dto = contactSql.GetContactByMailDTO(req);
  //   const data = contactSql.getContactByMail(dto.email);
  //   if (!data) {return res.status(404).json({ message: 'Contact not found' });}
  //   return res.status(201).json({ data });
  // });

  route.post('/', (req: any, res: Response, next: NextFunction) => {
    const dto = contactSql.createContactDTO(req);
    const data = contactSql.createContact(dto);
    if (!data) {
      return res.status(400).json({ success: false, message: "Contact creation failed" });
    }
    return res.status(201).json({ success: true, data });
  });

  route.put('/:email', async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log('🔍 Old Email from URL:', req.params.email);
        console.log('📩 Request Body:', req.body);
        const dto = contactSql.updateContactDTO(req);
        console.log('🔄 Converted DTO:', dto);
        const updatedContact = await contactSql.updateContact(req.params.email, dto);
        if (!updatedContact) {
            return res.status(404).json({ success: false, message: 'Contact not found' });
        }
        return res.status(200).json({ success: true, data: updatedContact });
    } catch (error: any) {
        console.error("❌ Error updating contact:", error.message);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});

route.delete('/:email', async (req: Request, res: Response, next: NextFunction) => {
  try {
      console.log("📩 Email from URL:", req.params.email);

      const isDeleted = await contactSql.deleteContact(req.params.email);

      if (!isDeleted) {
          return res.status(404).json({ success: false, message: "Contact not found" });
      }

      return res.status(200).json({ success: true, message: "Contact deleted successfully" }); // Fix: Use 200 for JSON response
  } catch (error: any) {
      console.error("❌ Error deleting contact:", error.message);
      return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});
};

// http://localhost:3000/api/contact_sql