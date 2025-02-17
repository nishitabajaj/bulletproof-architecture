import { Service, Inject } from 'typedi';
import jwt from 'jsonwebtoken';
import MailerService from './mailer';
import config from '@/config';
import argon2 from 'argon2';
import { randomBytes } from 'crypto';
import { IUser, IUserInputDTO } from '@/interfaces/IUser';
import { EventDispatcher, EventDispatcherInterface } from '@/decorators/eventDispatcher';
import events from '@/subscribers/events';
import { ContactDto,UpdateContactDto,DeleteContactDto, IContact } from '@/interfaces/IContact';
import user from '@/models/user';

@Service()
export default class ContactService {
  constructor(
    @Inject('logger') private logger,
  ) { 
  }

public async getContact(): Promise<ContactDto[]> {
    const contacts = await user.find();
    return contacts.map(contact => new ContactDto(contact));
}

public async getContactByEmail(email: string): Promise<ContactDto | null> {
  console.log("🛠️ Searching for email:", email); // Debugging
  const contact = await user.findOne({ email: { $regex: new RegExp(`^${email}$`, "i") } });
  console.log("📄 Query Result:", contact); // Debugging
  if (!contact) return null;
  return new ContactDto(contact); // Map to DTO
}

public contactCreateDto(req: any): IContact {
    if(!req.body.name){throw new Error('Name is required Field!!')}
    if(!req.body.phone){throw new Error('Phone is required Field!!')}
    if(!req.body.email){throw new Error('Email is required Field!!')}
    return {
      name: req.body.name,
      phone: req.body.phone,
      email: req.body.email, 
    }
  }

  
    public async contactCreate(dto: IContact): Promise<IContact> {
      try {
          console.log('🟢 Inserting Contact:', dto);
          const newContact = new user(dto);
          await newContact.save();
          console.log('✅ Contact Created Successfully:', newContact.toJSON());
          return dto;
      } catch (error) {
          console.error('❌ Error saving contact:', error);
          throw new Error('Database insertion failed');
      }
  }

  public contactUpdateDto(req: any): UpdateContactDto{
    const dto = new UpdateContactDto()
    if(req.body.name){
      dto.name = req.body.name;
    }
    if(req.body.phone){ // <-- Check if this condition exists
      dto.phone = req.body.phone;
    }
    if(req.body.email){
      dto.email=req.body.email;
    }

    return dto;
  }

  public async contactUpdate(contactId: string, updateData: ContactDto): Promise<IContact | null> {
    if (!contactId) {
      throw new Error("Contact ID is required");
    }
  
    // Mock database update operation
    const existingContact: IContact | null = await this.findContactById(contactId);
    if (!existingContact) {
      return null; // Contact not found
    }
  
    const updatedContact: IContact = {
      ...existingContact,
      ...updateData,
    };

    this.logger.info(`Contact updated: ${JSON.stringify(updatedContact)}`);
    return updatedContact;
  }

  private async findContactById(contactId: string): Promise<IContact | null> {
    try {
        // Fetch contact details from the database
        const contact = await user.findById(contactId).select("name email phone").lean();
        if (!contact) {
            console.warn(`Contact with ID ${contactId} not found.`);
            return null;
        }
        return {
          name: contact.name,
          email: contact.email,
          phone: contact.phone};
    } catch (error) {
        console.error("Error fetching contact by ID:", error);
        return null;
    }
  }

  public DeleteContactDTO(req: any): DeleteContactDto{
    if(!req.body.email){
      throw new Error("Please enter a mail for contact deletion.")
    }
    return {email: req.body.email};
  }

  public async deleteContact(email: string): Promise<void> {
    const contact = await user.findOne({ email: email }); // Correct way to query

    if (!contact) {
        throw new Error("Contact not found");
    }
    await user.deleteOne({ email: email }); // Delete contact
    console.log(`Contact with email ${email} deleted successfully`);
  }
   
}