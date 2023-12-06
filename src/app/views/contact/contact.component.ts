// Import necessary modules and services
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from 'src/app/services/toast.service';
import { ContactService } from 'src/app/services/contact.service';
import { Contact } from 'src/app/interfaces/contact.interface';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
})
export class ContactComponent implements OnInit {
  // Identifier for the contact being edited (if any)
  contactId: string | null;

  // Form group to handle contact data
  contactForm: FormGroup;

  // Text to display in the heading based on whether it's a create or update operation
  h1Text: string;

  constructor(
    // Inject FormBuilder for building the form, ContactService for managing contact data,
    // ActivatedRoute for retrieving route parameters, ToastService for displaying notifications,
    // and Router for navigation
    private fb: FormBuilder,
    private contactService: ContactService,
    private activatedRoute: ActivatedRoute,
    private toastService: ToastService,
    private router: Router
  ) {
    // Initialize the contactId from the route parameter and set up the contactForm with default values
    this.contactId = this.activatedRoute.snapshot.paramMap.get('id');

    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      surname: [''],
      phoneNumber: ['', Validators.required],
      email: [''],
    });
  }

  ngOnInit() {
    // Check if the component is in edit mode and set the appropriate heading text
    this.isEdit();
  }

  // Check if the component is in edit mode and set heading text accordingly
  isEdit() {
    if (this.contactId !== null) {
      this.h1Text = 'update';
      // Fetch the details of the contact with the provided ID
      this.contactService.getContactById(this.contactId).subscribe(
        // Success callback
        (contact) => {
          // Populate the form with the details of the contact being edited
          this.contactForm.setValue({
            name: contact.name,
            surname: contact.surname,
            phoneNumber: contact.phoneNumber,
            email: contact.email,
          });
        },
        // Error callback
        (error) => {
          // Redirect to the contacts page if there's an error fetching contact details
          this.router.navigate(['/contacts']);
          console.log('Error fetching contact details:', error);
        }
      );
    } else {
      this.h1Text = 'create';
    }
  }

  // Save the contact data, either creating a new contact or updating an existing one
  saveContact() {
    // Create a Contact object with the form values
    const contact: Contact = {
      name: this.contactForm.value.name,
      surname: this.contactForm.value.surname,
      phoneNumber: this.contactForm.value.phoneNumber,
      email: this.contactForm.value.email,
    };

    // Check if it's an edit operation and call the appropriate service method
    if (this.contactId !== null) {
      // Update an existing contact
      this.contactService.updateContact(contact, this.contactId).subscribe(
        // Success callback
        (res) => {
          console.log(res);
          this.router.navigate(['/contacts']);
          this.toastService.initiate({
            title: 'Contact Updated',
            content: 'The contact was updated successfully',
          });
        },
        // Error callback
        (err) => {
          console.error(err);
          this.toastService.initiate({
            title: 'Error',
            content: err.error.message,
          });
        }
      );
    } else {
      // Create a new contact
      this.contactService.newContact(contact).subscribe(
        // Success callback
        (res) => {
          console.log(res);
          this.router.navigate(['/contacts']);
          this.toastService.initiate({
            title: 'Contact Created',
            content: 'The contact was created successfully',
          });
        },
        // Error callback
        (err) => {
          console.error(err);
          this.toastService.initiate({
            title: 'Error',
            content: err.error.message,
          });
        }
      );
    }
  }

  // Delete the contact
  deleteContact() {
    this.contactService.deleteContact(this.contactId).subscribe(
      // Success callback
      (res) => {
        console.log(res);
        this.router.navigate(['/contacts']);
        this.toastService.initiate({
          title: 'Contact Deleted',
          content: 'The contact was deleted successfully',
        });
      },
      // Error callback
      (err) => {
        console.error(err);
        this.toastService.initiate({
          title: 'Error',
          content: err.error.message,
        });
      }
    );
  }
}
