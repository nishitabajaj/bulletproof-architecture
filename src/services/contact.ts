import { Service, Inject } from 'typedi';
import jwt from 'jsonwebtoken';
import MailerService from './mailer';
import config from '@/config';
import argon2 from 'argon2';
import { randomBytes } from 'crypto';
import { IUser, IUserInputDTO } from '@/interfaces/IUser';
import { EventDispatcher, EventDispatcherInterface } from '@/decorators/eventDispatcher';
import events from '@/subscribers/events';
import { ContactDto, IContact } from '@/interfaces/IContact';

@Service()
export default class ContactService {
  constructor(
    @Inject('logger') private logger,
  ) {
    
  }

  public contactCreateDto(req: any): IContact {
    if(!req.body.name){
      throw new Error('Name is required Field!!')
    }
    if(!req.body.phone){
      throw new Error('Phone is required Field!!')
    }
    if(!req.body.email){
      throw new Error('Email is required Field!!')
    }
    return {
      name: req.body.name,
      phone: req.body.phone,
      email: req.body.email, 
    }
  }

  public contactCreate(dto: IContact): any {
    // const query = 'Create '
    return dto;
  }

  public contactUpdateDto(req: any): ContactDto{
    const dto = new ContactDto()
    if(req.body.name){
      dto.name = req.body.name;
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
    // Simulate database lookup
    return {
      name: "Existing Name",
      phone: 123-456-7890, // Ensure this matches the type defined in IContact
      email: "existing@example.com",
    };
  }
   
}