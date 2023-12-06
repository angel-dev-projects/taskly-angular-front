// Import necessary modules and services
import { Component, OnInit } from '@angular/core';
import { Contact } from 'src/app/interfaces/contact.interface';
import { ContactService } from 'src/app/services/contact.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-list-contacts',
  templateUrl: './list-contacts.component.html',
  styleUrls: ['./list-contacts.component.css'],
})
export class ListContactsComponent implements OnInit {
  // Array to store all contacts and filtered contacts based on search term
  contacts: Contact[] = [];
  filteredContacts: Contact[] = [];

  // Variable to store the search term entered by the user
  searchTerm: string = '';

  constructor(
    // Inject ContactService for fetching contact data and ToastService for displaying notifications
    private contactService: ContactService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    // Initialize the component by fetching contacts
    this.getContacts();
  }

  // Function to fetch all contacts from the ContactService
  getContacts() {
    this.contactService.getAllContacts().subscribe(
      // Success callback
      (contactsObtained: Contact[]) => {
        // Map the obtained contacts to a simplified format
        this.contacts = contactsObtained.map((contact: Contact) => ({
          id: contact.id,
          name: contact.name,
          surname: contact.surname,
          phoneNumber: contact.phoneNumber,
          email: contact.email,
        }));

        // Sort the contacts alphabetically by name
        this.contacts.sort((a, b) => a.name.localeCompare(b.name));

        // Initialize the filtered contacts with all contacts initially
        this.filteredContacts = [...this.contacts];
      },
      // Error callback
      (err) => {
        // Log the error and display a toast notification
        console.error(err);
        this.toastService.initiate({
          title: 'Error',
          content: 'Error fetching the contacts',
        });
      }
    );
  }

  // Function to filter contacts based on the search term
  filterContacts() {
    this.filteredContacts = this.contacts.filter(
      (contact) =>
        contact.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        contact.surname.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
}
