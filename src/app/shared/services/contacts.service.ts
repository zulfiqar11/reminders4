import { DataService } from 'src/app/shared/services/data.service';
import { Injectable } from '@angular/core';
import { Contact } from 'src/app/shared/model/contact';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactsService {

  constructor(private dataService: DataService<Contact>) {
    this.dataService.Url('api/contacts');
  }

  getContactList(): Observable<Contact[]> {
    return this.dataService.get();
  }

  Delete(contact: Contact): Observable<Contact> {
    return this.dataService.delete(contact, contact.id);
  }
}

