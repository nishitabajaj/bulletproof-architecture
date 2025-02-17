export interface IContact {
  name: string;
  phone: number;
  email: string;
}

export class ContactDto {
  name: string;
  phone: number;
  email: string;

  constructor(contact: IContact) {
    this.name = contact.name;
    this.phone = contact.phone;
    this.email = contact.email;
}
}

export class CreateContactDto{
  name: string;
  phone: number;
  email: string;
}

export class UpdateContactDto{
  name: string;
  phone: number;
  email: string;
}

export class GetContactDto{
  name: string;
  phone: number;
  email: string;
}

export class GetContactByMailDto{
  name: string;
  phone: number;
  email: string;
}

export class DeleteContactDto{
  email: string;
}

export interface GetById{
  id: number;
}