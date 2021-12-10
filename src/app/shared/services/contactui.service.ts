import { Injectable } from '@angular/core';
import { Reminder } from '../model/reminder';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactuiService {

  contactValueSubject = new Subject<number>();
  contactValue = this.contactValueSubject.asObservable();

  selectedContactSubject = new Subject<FormGroup>();
  selectedContact = this.selectedContactSubject.asObservable();

  emptyOutContactSubject = new Subject();
  emptyOutContact = this.emptyOutContactSubject.asObservable();

  emptyOutContactListSubject = new Subject();
  emptyOutContactList = this.emptyOutContactListSubject.asObservable();

  populateContactGroupSubject = new Subject<Reminder>();
  populateContactGroup = this.populateContactGroupSubject.asObservable();

  constructor() { }
}
