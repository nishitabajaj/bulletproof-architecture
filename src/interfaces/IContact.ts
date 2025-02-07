export interface IContact {
  name: string;
  phone: number;
  email: string;
}

export class ContactDto {
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