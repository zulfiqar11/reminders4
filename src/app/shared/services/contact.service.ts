import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Contact } from '../model/contact';


@Injectable({
  providedIn: 'root'
})
export class ContactService {

  private url = 'api/contacts';

  constructor(private http: HttpClient) {}

  getContacts(): Observable<Contact[]> {
    return this.http.get<Contact[]>(this.url);
  }

  update(contact: Contact) : Observable<Contact> {
    const url = `${this.url}/${contact.id}`;
    return this.http.put<Contact>(url, contact);
  }

  create(contact: Contact) : Observable<Contact> {
    const url = `${this.url}`;
    return this.http.post<Contact>(url, contact);
  }

  delete(contact: Contact) : Observable<Contact> {
    const url = `${this.url}/${contact.id}`;
    return this.http.delete<Contact>(url);
  }
}



