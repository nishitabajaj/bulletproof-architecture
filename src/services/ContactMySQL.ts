import Contact from '@/models/ContactModel';
import { Service, Inject } from 'typedi';
import jwt from 'jsonwebtoken';
import MailerService from './mailer';
import config from '@/config';
import argon2 from 'argon2';
import { randomBytes } from 'crypto';
import { IUser, IUserInputDTO } from '@/interfaces/IUser';
import { EventDispatcher, EventDispatcherInterface } from '@/decorators/eventDispatcher';
import events from '@/subscribers/events';
import { ContactDto, GetContactByMailDto, CreateContactDto, GetContactDto, IContact, UpdateContactDto, DeleteContactDto, GetById } from '@/interfaces/IContact';

@Service()
export default class ContactMySQL {

  // ✅ Create Contact DTO
  public createContactDTO(req: any): ContactDto {
    if (!req.body.name) { throw new Error("Name is required"); }
    if (!req.body.phone) { throw new Error("Phone number is required"); }
    if (!req.body.email) { throw new Error("Email is required"); }
    return {
      name: req.body.name,
      phone: req.body.phone,
      email: req.body.email,
    };
  }

  // ✅ Create Contact
  public async createContact(dto: CreateContactDto): Promise<Contact | null> {
    try {
      console.log('🟢 Inserting Contact:', dto);
      const contact = await Contact.create({ ...dto });
      console.log('✅ Contact Created Successfully:', contact.toJSON());
      return contact;
    } catch (error: any) {
      console.error('❌ Error creating contact:', error.message);
      console.error('🛠️ Full error details:', error);
      return null;
    }
  }

  // ✅ Update Contact DTO
  public updateContactDTO(req: any): UpdateContactDto {
    // const dto = new UpdateContactDto()
    if (!req.body.email) { throw new Error("Mail is required"); }

    // if(req.body.name){dto.name= req.body.name; }
    // if(req.body.phone){dto.phone= req.body.phone; }

    return {
      name: req.body.name,
      phone: req.body.phone,
      email: req.body.email,
    };
  }

  // ✅ Update Contact
  public async updateContact(oldEmail: string, updateData: UpdateContactDto): Promise<IContact | null> {
    try {
      console.log('🔍 Searching for contact with email:', oldEmail);

      const contact = await Contact.findOne({ where: { email: oldEmail } });

      if (!contact) {
        console.log('❌ Contact not found:', oldEmail);
        return null;
      }

      console.log('✅ Contact found:', contact.toJSON());
      console.log('🔄 Updating contact with data:', updateData);

      // ✅ Update fields (including email)
      if (updateData.email) contact.email = updateData.email;
      if (updateData.name) contact.name = updateData.name;
      if (updateData.phone) contact.phone = updateData.phone;

      // ✅ Save the updated contact
      await contact.save();

      console.log('🟢 Contact updated successfully:', contact.toJSON());

      return contact;
    } catch (error: any) {
      console.error('❌ Error updating contact:', error.message);
      return null;
    }
  }

  // ✅ Get Contact DTO
  public GetContactDTO(req: any): GetById {
    return {
      id: +req.params.id
    };
  }


  // ✅ Get Contact
  public getContact(dto: GetById): Promise<IContact[] | null> {
    // const whereCondition: any = {};

    // if (dto.name) whereCondition.name = dto.name;
    // if (dto.phone) whereCondition.phone = dto.phone;
    // if (dto.email) whereCondition.email = dto.email;
    // return Contact.findOne({ where: { id: dto.id }});
    return Contact.findAll();
  }

  public GetContactByMailDTO(req: any): GetContactByMailDto {
    if (!req.body.email) {
      throw new Error("Mail is required");
    }
    return {
      name: req.body.name,
      phone: req.body.phone,
      email: req.body.email,
    }
  }

  public getContactByMail(email: string) {
    return Contact.findOne({ where: { email } });
  }

  public DeleteContactDTO(req: any): DeleteContactDto {
    if (!req.body.email) {
      throw new Error("Please enter a mail for contact deletion.")
    }
    return { email: req.body.email };
  }

  public async deleteContact(email: string): Promise<boolean> {
    try {
      console.log("🔍 Searching for contact with email:", email);
      const contact = await Contact.findOne({ where: { email } });
      if (!contact) {
        console.log("❌ Contact not found:", email);
        return false;
      }
      console.log("🗑️ Deleting contact:", email);
      await contact.destroy();  // Fix: Call `destroy()` on the instance
      console.log("✅ Contact deleted successfully");
      return true;
    } catch (error: any) {
      console.error("❌ Error deleting contact:", error.message);
      return false;
    }
  }


}