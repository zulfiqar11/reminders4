import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Reminder } from '../model/reminder';

@Injectable({
  providedIn: 'root'
})
export class ReminderService {

  private url = '';

  constructor(private http: HttpClient, @Inject('theComponentUrl') private theComponentUrl?: string) {
    this.url = this.url + theComponentUrl;
  }

  get(): Observable<Reminder[]> {
    return this.http.get<Reminder[]>(this.url);
  }

  update(reminder: Reminder) : Observable<Reminder> {
    const url = `${this.url}/${reminder.id}`;
    return this.http.put<Reminder>(url, reminder);
  }

  create(reminder: Reminder) : Observable<Reminder> {
    const url = `${this.url}`;
    return this.http.post<Reminder>(url, reminder);
  }

  delete(reminder: Reminder) : Observable<Reminder> {
    const url = `${this.url}/${reminder.id}`;
    return this.http.delete<Reminder>(url);
  }
}
