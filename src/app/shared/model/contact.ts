// TODO: refactor and review these
export interface Contact {
    id: number;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    emailAddress: string;
}

export interface ContactDisplay {
  value: string;
  viewValue: string;
}

export interface ContactsList {
  id: number;
  listName: string;
  contactsCount: number;
  addedDate: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
}

export interface ContactsListDisplay {
  listName: string;
  contactsCount: number;
  addedDate: string;
}

export interface ContactsListNames{
  id: number;
  contactsListId : number;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
}
