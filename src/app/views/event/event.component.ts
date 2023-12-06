// Import necessary modules and services
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventService } from 'src/app/services/event.service';
import { format } from 'date-fns';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from 'src/app/services/toast.service';
import { Event } from 'src/app/interfaces/event.interface';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css'],
})
export class EventComponent implements OnInit {
  // Identifier for the event being edited (if any)
  eventId: string | null;

  // Form group to handle event data
  eventForm: FormGroup;

  // Text to display in the heading based on whether it's a create or update operation
  h1Text: string;

  // Character count for title and description fields
  titleCharacterCount: number = 0;
  descriptionCharacterCount: number = 0;

  constructor(
    // Inject FormBuilder for building the form, EventService for managing event data,
    // ActivatedRoute for retrieving route parameters, ToastService for displaying notifications,
    // and Router for navigation
    private fb: FormBuilder,
    private eventService: EventService,
    private activatedRoute: ActivatedRoute,
    private toastService: ToastService,
    private router: Router
  ) {
    // Initialize the eventId from the route parameter and set up the eventForm with default values
    this.eventId = this.activatedRoute.snapshot.paramMap.get('id');

    this.eventForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      startDate: [format(new Date(), 'yyyy-MM-dd'), Validators.required],
      startTime: [format(new Date(), 'HH:mm')],
      endDate: [format(new Date(), 'yyyy-MM-dd'), Validators.required],
      endTime: [format(new Date(), 'HH:mm')],
      allDay: [false],
      backgroundColor: ['#0000FF', Validators.required],
      borderColor: ['#ff1414', Validators.required],
      textColor: ['#ffffff', Validators.required],
    });
  }

  ngOnInit() {
    // Check if the component is in edit mode and set the appropriate heading text
    this.isEdit();

    // Subscribe to changes in the title and description fields to update character counts
    this.eventForm.get('title').valueChanges.subscribe(() => {
      this.updateCharacterCount();
    });

    this.eventForm.get('description').valueChanges.subscribe(() => {
      this.updateCharacterCount();
    });
  }

  // Check if the component is in edit mode and set heading text accordingly
  isEdit() {
    if (this.eventId !== null) {
      this.h1Text = 'update';
      this.eventService.getEventById(this.eventId).subscribe(
        // Success callback
        (event) => {
          // Populate the form with the details of the event being edited
          this.eventForm.setValue({
            title: event.title,
            description: event.description,
            startDate: format(new Date(event.start_date), 'yyyy-MM-dd'),
            startTime: format(new Date(event.start_date), 'HH:mm'),
            endDate: format(new Date(event.end_date), 'yyyy-MM-dd'),
            endTime: format(new Date(event.end_date), 'HH:mm'),
            allDay: event.allDay,
            backgroundColor: event.backgroundColor,
            borderColor: event.borderColor,
            textColor: event.textColor,
          });
        },
        // Error callback
        (error) => {
          // Redirect to home page if there's an error fetching event details
          this.router.navigate(['/home']);
          console.log('Error fetching event details:', error);
        }
      );
    } else {
      this.h1Text = 'create';
    }
  }

  // Save the event data, either creating a new event or updating an existing one
  saveEvent() {
    // Combine date and time fields into start and end date-time strings
    const startDateTime = this.combineDateAndTime(
      this.eventForm.value.startDate,
      this.eventForm.value.startTime,
      this.eventForm.value.allDay
    );
    const endDateTime = this.combineDateAndTime(
      this.eventForm.value.endDate,
      this.eventForm.value.endTime,
      this.eventForm.value.allDay
    );

    // Create an Event object with the form values
    const event: Event = {
      title: this.eventForm.value.title,
      description: this.eventForm.value.description,
      start_date: startDateTime,
      end_date: endDateTime,
      allDay: this.eventForm.value.allDay,
      backgroundColor: this.eventForm.value.backgroundColor,
      borderColor: this.eventForm.value.borderColor,
      textColor: this.eventForm.value.textColor,
    };

    // Check if it's an edit operation and call the appropriate service method
    if (this.eventId !== null) {
      // Update an existing event
      this.eventService.updateEvent(event, this.eventId).subscribe(
        // Success callback
        (res) => {
          console.log(res);
          this.router.navigate(['/home']);
          this.toastService.initiate({
            title: 'Event Updated',
            content: 'The event was updated successfully',
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
      // Create a new event
      this.eventService.newEvent(event).subscribe(
        // Success callback
        (res) => {
          console.log(res);
          this.router.navigate(['/home']);
          this.toastService.initiate({
            title: 'Event Created',
            content: 'The event was created successfully',
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

  // Delete the event after confirmation
  deleteEvent() {
    Swal.fire({
      title: 'Delete event',
      text: 'Are you sure you want to delete this event?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Confirm',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.eventService.deleteEvent(this.eventId).subscribe(
          // Success callback
          (res) => {
            console.log(res);
            this.router.navigate(['/home']);
            this.toastService.initiate({
              title: 'Event Deleted',
              content: 'The event was deleted successfully',
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
    });
  }

  // Combine date and time into a formatted date-time string
  combineDateAndTime(date: string, time: string, allDay: boolean) {
    const dateTimeString = allDay ? `${date}T00:00` : `${date}T${time}`;
    return format(new Date(dateTimeString), 'yyyy-MM-dd HH:mm');
  }

  // Update character counts for title and description fields
  updateCharacterCount() {
    this.titleCharacterCount = this.eventForm.get('title').value.length;
    this.descriptionCharacterCount =
      this.eventForm.get('description').value.length;
  }
}
