// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Inject, Injectable } from '@angular/core';
// import { Observable } from 'rxjs';
// import { Contact } from '../model/contact';


// @Injectable({
//   providedIn: 'root'
// })
// export class ContactService {

//   private url = '';

//   constructor(private http: HttpClient, @Inject('theComponentUrl') private theComponentUrl?: string) {
//     this.url = this.url + theComponentUrl;
//   }

//   get(): Observable<Contact[]> {
//     return this.http.get<Contact[]>(this.url);
//   }

//   update(contact: Contact) : Observable<Contact> {
//     const url = `${this.url}/${contact.id}`;
//     return this.http.put<Contact>(url, contact);
//   }

//   create(contact: Contact) : Observable<Contact> {
//     const url = `${this.url}`;
//     return this.http.post<Contact>(url, contact);
//   }

//   delete(contact: Contact) : Observable<Contact> {
//     const url = `${this.url}/${contact.id}`;
//     return this.http.delete<Contact>(url);
//   }
// }



