import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Contact } from '../model/contact';


@Injectable({
  providedIn: 'root'
})
export class ContactNamesService {

  private url = 'api/contacts';

  constructor(private http: HttpClient) {}

  get(): Observable<Contact[]> {
    return this.http.get<Contact[]>(this.url);
  }

}



