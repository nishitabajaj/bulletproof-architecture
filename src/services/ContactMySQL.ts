import Contact from '@/models/ContactModel';
import {Service, Inject} from 'typedi';
import jwt from 'jsonwebtoken';
import MailerService from './mailer';
import config from '@/config';
import argon2 from 'argon2';
import { randomBytes } from 'crypto';
import { IUser, IUserInputDTO } from '@/interfaces/IUser';
import { EventDispatcher, EventDispatcherInterface } from '@/decorators/eventDispatcher';
import events from '@/subscribers/events';
import { ContactDto, GetContactByMailDto, GetContactDto, IContact, UpdateContactDto, DeleteContactDto } from '@/interfaces/IContact';

@Service()
export default class ContactMySQL{

  public createContactDTO(req: any): ContactDto{
    if (!req.body.name){
      throw new Error("Name is required");
    }
    if(!req.body.phone){
      throw new Error("Phone number is required");
    }
    if(!req.body.email){
      throw new Error("Email is required");
    }
    return {
      name: req.body.name,
      phone: req.body.phone,
      email: req.body.email, 
    }
  }

  public createContact(dto: ContactDto){
    return dto;
  }

  public updateContactDTO(req: any): UpdateContactDto{
    const dto = new UpdateContactDto()
    if(!req.body.email){
      throw new Error("Mail is required");
    }
    if(req.body.name){
      dto.name= req.body.name;
    }
    if(req.body.phone){
      dto.phone= req.body.phone;
    }
    return {name: req.body.name,
      phone: req.body.phone,
      email: req.body.email, };
  }

  public  updateContact(email: string, updateData: UpdateContactDto): Promise<ContactDto>{
    const contact = Contact.findByPk(email);
    if (!contact){
      throw new Error('Contact not found');
    }
    // Contact.update(updateData);
    Contact.update(updateData,{ where: {email: email} });
    return contact;
  }

  public GetContactDTO(req: any): GetContactDto{
    return {name: req.body.name,
      phone: req.body.phone,
      email: req.body.email, };
  }

  public getContact(dto: GetContactDto){
    return dto;
  }

  public GetContactByMailDTO(req: any): GetContactByMailDto{
    if(!req.body.mail){
      throw new Error("Mail is required");
    }
    return {
      name: req.body.name,
      phone: req.body.phone,
      email: req.body.email, 
    }
  }

  public getContactByMail(email: string){
    return Contact.findByPk(email);
  }
  
  public DeleteContactDTO(req: any): DeleteContactDto{
    if(!req.body.mail){
      throw new Error("Please enter a mail for contact deletion.")
    }
    return;
  }

  public deleteContact(email: string, deleteData: DeleteContactDto){
    const contact = Contact.findByPk(email);
    if (!contact){
      throw new Error("Contact not found");
    }
  }
}