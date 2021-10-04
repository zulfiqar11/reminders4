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



  // get(contactId: number): Observable<Contact>
  // {
  //   return this.http.get<Contact>(this.url + '/' + contactId);
  // }

  // private url = 'http://localhost:4200/api/contacts';

  // private headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  // private headers = new HttpHeaders({
  //   'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
  //   'Access-Control-Allow-Origin':'*',
  //   'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE'
  // });
  // private headers = new HttpHeaders({
  //   'Access-Control-Allow-Origin':'*',
  //   'Access-Control-Allow-Headers': 'X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method, Authorization',
  //   'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE'
  // });


      // const url = `${this.url}/${contact.Id}`;

    // return this.http.put<Contact>(url,contact,{ headers: this.headers} );
    // return this.http.put<Contact>(this.url + '/' + contact.Id,contact, {headers: this.headers});
    // this.http.put<Contact>(this.url + '/' + contact.Id,contact).subscribe(() => console.log('all done'));

        // return this.http.get<Contact>(this.url + '/' + contactId, {headers: this.headers});
