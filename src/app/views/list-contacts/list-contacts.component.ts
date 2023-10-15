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
  contacts: Contact[] = [];

  constructor(
    private contactService: ContactService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.getContacts();
  }

  getContacts() {
    this.contactService.getAllContacts().subscribe(
      (contactsObtained: Contact[]) => {
        this.contacts = contactsObtained.map((contact: Contact) => ({
          id: contact.id,
          name: contact.name,
          surname: contact.surname,
          phoneNumber: contact.phoneNumber,
          email: contact.email,
        }));

        this.contacts.sort((a, b) => {
          if (a.name < b.name) return -1;
          if (a.name > b.name) return 1;
          return 0;
        });
      },
      (err) => {
        console.error(err);
        this.toastService.initiate({
          title: 'Error',
          content: 'Error fetching the contacts',
        });
      }
    );
  }
}
