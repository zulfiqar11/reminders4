import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Contact, ContactsNameDisplay } from '../model/contact';


@Injectable({
  providedIn: 'root'
})
export class ContactNamesService {

  private url = 'api/contacts';
  activatedEmitter = new Subject<ContactsNameDisplay[]>()

  constructor(private http: HttpClient) {}

  get(): Observable<Contact[]> {
    return this.http.get<Contact[]>(this.url);
  }

}



