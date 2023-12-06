// Import necessary modules and services
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Event } from 'src/app/interfaces/event.interface';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  // Base URL for event-related API endpoints
  private URL = environment.apiUrl;

  // Constructor to inject HttpClient
  constructor(private http: HttpClient) {}

  // Method to create a new event
  newEvent(event: Event) {
    return this.http.post<Event>(this.URL + 'events', event);
  }

  // Method to fetch all events
  getAllEvents() {
    return this.http.get<Event[]>(this.URL + 'events');
  }

  // Method to fetch an event by its ID
  getEventById(id: string) {
    return this.http.get<Event>(this.URL + 'events/' + id);
  }

  // Method to update an existing event
  updateEvent(event: Event, eventId: string) {
    return this.http.put<Event>(this.URL + `events/${eventId}`, event);
  }

  // Method to delete an event by its ID
  deleteEvent(eventId: string) {
    return this.http.delete(this.URL + `events/${eventId}`);
  }
}
