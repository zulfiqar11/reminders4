export interface Contact {
    id: number;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    emailAddress: string;
    image: string;
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
  id: number;
  listName: string;
  contactsCount: number;
  addedDate: string;
}

export interface ContactsNameDisplay {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
}
