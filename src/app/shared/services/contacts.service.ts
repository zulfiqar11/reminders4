import { DataService } from 'src/app/shared/services/data.service';
import { Injectable } from '@angular/core';
import { Contact } from 'src/app/shared/model/contact';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactsService {

  private onSaveSubject = new Subject();
  onSave = this.onSaveSubject.asObservable();

  constructor(private dataService: DataService<Contact>) {
    this.dataService.Url('api/contacts');
  }

  getContactList(): Observable<Contact[]> {
    return this.dataService.get();
  }

  Delete(contact: Contact): Observable<Contact> {
    return this.dataService.delete(contact, contact.id);
  }

  Save(contact: Contact) {
    if (contact?.id === 0) {
      this.dataService.get().subscribe(contacts => {
        let maxId = contacts[contacts.length - 1].id + 1;
        contact.id = maxId;
        this.dataService.create(contact).subscribe(() => this.onSaveSubject.next());
      })
    } else {
      this.dataService.update(contact, contact.id).subscribe(() => this.onSaveSubject.next());
    }
  }
}

