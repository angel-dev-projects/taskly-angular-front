import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Event } from 'src/app/interfaces/event.interface';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private URL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAllEvents() {
    return this.http.get<Event[]>(this.URL + 'events');
  }
}
