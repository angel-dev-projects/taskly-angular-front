import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Contact } from '../interfaces/contact.interface';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  private URL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  newContact(contact: Contact) {
    return this.http.post<Contact>(this.URL + 'contacts', contact);
  }

  getAllContacts() {
    return this.http.get<Contact[]>(this.URL + 'contacts');
  }

  getContactById(id: string) {
    return this.http.get<Contact>(this.URL + 'contacts/' + id);
  }

  updateContact(contact: Contact, contactId: string) {
    return this.http.put<Contact>(this.URL + `contacts/${contactId}`, contact);
  }

  deleteContact(contactId: string) {
    return this.http.delete(this.URL + `contacts/${contactId}`);
  }
}
