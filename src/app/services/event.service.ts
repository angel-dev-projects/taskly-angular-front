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

  newEvent(event: Event) {
    return this.http.post<Event>(this.URL + 'events', event);
  }

  getAllEvents() {
    return this.http.get<Event[]>(this.URL + 'events');
  }

  getEventById(id: string) {
    return this.http.get<Event>(this.URL + 'events/' + id);
  }

  updateEvent(event: Event, eventId: string) {
    return this.http.put<Event>(this.URL + `events/${eventId}`, event);
  }

  deleteEvent(eventId: string) {
    return this.http.delete(this.URL + `events/${eventId}`);
  }
}
