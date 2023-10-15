import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
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
  contactId: string | null;
  contactForm: FormGroup;
  h1Text: string;

  constructor(
    private fb: FormBuilder,
    private contactService: ContactService,
    private activatedRoute: ActivatedRoute,
    private toastService: ToastService,
    private router: Router
  ) {
    this.contactId = this.activatedRoute.snapshot.paramMap.get('id'); // Get the contact ID from the URL

    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      surname: [''],
      phoneNumber: ['', Validators.required],
      email: [''],
    });
  }

  ngOnInit() {
    this.isEdit(); // Check if the component is in edit mode and populate contact details if necessary
  }

  // Function to check if the component is in edit mode and fetch contact details if necessary
  isEdit() {
    if (this.contactId !== null) {
      this.h1Text = 'update';
      // Get the details of the contact with the provided ID
      this.contactService.getContactById(this.contactId).subscribe(
        (contact) => {
          // Populate the component properties with the contact details
          this.contactForm.setValue({
            name: contact.name,
            surname: contact.surname,
            phoneNumber: contact.phoneNumber,
            email: contact.email,
          });
        },
        (error) => {
          this.router.navigate(['/home']);
          console.log('Error fetching contact details:', error);
        }
      );
    } else {
      this.h1Text = 'create';
    }
  }

  saveContact() {
    const contact: Contact = {
      name: this.contactForm.value.name,
      surname: this.contactForm.value.surname,
      phoneNumber: this.contactForm.value.phoneNumber,
      email: this.contactForm.value.email,
    };

    if (this.contactId !== null) {
      this.contactService.updateContact(contact, this.contactId).subscribe(
        (res) => {
          console.log(res);
          this.router.navigate(['/contacts']);
          this.toastService.initiate({
            title: 'Contact Updated',
            content: 'The contact was updated successfully',
          });
        },
        (err) => {
          console.error(err);
          this.toastService.initiate({
            title: 'Error',
            content: err.error.message,
          });
        }
      );
    } else {
      this.contactService.newContact(contact).subscribe(
        (res) => {
          console.log(res);
          this.router.navigate(['/contacts']);
          this.toastService.initiate({
            title: 'Contact Created',
            content: 'The contact was created successfully',
          });
        },
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

  deleteContact() {
    Swal.fire({
      title: 'Delete contact',
      text: 'Are you sure you want to delete this contact?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Confirm',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.contactService.deleteContact(this.contactId).subscribe(
          (res) => {
            console.log(res);
            this.router.navigate(['/contacts']);
            this.toastService.initiate({
              title: 'Contact Deleted',
              content: 'The contact was deleted successfully',
            });
          },
          (err) => {
            console.error(err);
            this.toastService.initiate({
              title: 'Error',
              content: err.error.message,
            });
          }
        );
      }
    });
  }
}
