// Import necessary modules and services
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Contact } from '../interfaces/contact.interface';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  // Base URL for contact-related API endpoints
  private URL = environment.apiUrl;

  // Constructor to inject HttpClient
  constructor(private http: HttpClient) {}

  // Method to create a new contact
  newContact(contact: Contact) {
    return this.http.post<Contact>(this.URL + 'contacts', contact);
  }

  // Method to fetch all contacts
  getAllContacts() {
    return this.http.get<Contact[]>(this.URL + 'contacts');
  }

  // Method to fetch a contact by its ID
  getContactById(id: string) {
    return this.http.get<Contact>(this.URL + 'contacts/' + id);
  }

  // Method to update an existing contact
  updateContact(contact: Contact, contactId: string) {
    return this.http.put<Contact>(this.URL + `contacts/${contactId}`, contact);
  }

  // Method to delete a contact by its ID
  deleteContact(contactId: string) {
    return this.http.delete(this.URL + `contacts/${contactId}`);
  }
}
