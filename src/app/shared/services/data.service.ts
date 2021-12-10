import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { Reminder } from '../model/reminder';

@Injectable({
  providedIn: 'root'
})
export class DataService<T> {

  private url = '';

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


  constructor(private http: HttpClient) {}

  Url(path: string) {
    this.url = path;
  }

  get(): Observable<T[]> {
    return this.http.get<T[]>(this.url);
  }

  update(theObject: T, objectId: number) : Observable<T> {
    const url = `${this.url}/${objectId}`;
    return this.http.put<T>(url, theObject);
  }

  create(theObject: T) : Observable<T> {
    const url = `${this.url}`;
    return this.http.post<T>(url, theObject);
  }

  delete(theObject: T, objectId: number) : Observable<T> {
    const url = `${this.url}/${objectId}`;
    return this.http.delete<T>(url);
  }
}
