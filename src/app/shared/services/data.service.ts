import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class DataService<T> {

  private url = '';

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
