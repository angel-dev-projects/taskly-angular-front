import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventService } from 'src/app/services/event.service';
import * as moment from 'moment';
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
  eventId: string | null;
  eventForm: FormGroup;
  h1Text: string;
  titleCharacterCount: number = 0;
  descriptionCharacterCount: number = 0;

  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private activatedRoute: ActivatedRoute,
    private toastService: ToastService,
    private router: Router
  ) {
    this.eventId = this.activatedRoute.snapshot.paramMap.get('id'); // Get the event ID from the URL

    this.eventForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      startDate: [moment(new Date()).format('YYYY-MM-DD'), Validators.required],
      startTime: [moment(new Date()).format('HH:mm')],
      endDate: [moment(new Date()).format('YYYY-MM-DD'), Validators.required],
      endTime: [moment(new Date()).format('HH:mm')],
      allDay: [false],
      backgroundColor: ['#0000FF', Validators.required],
      borderColor: ['#ff1414', Validators.required],
      textColor: ['#ffffff', Validators.required],
    });
  }

  ngOnInit() {
    this.isEdit(); // Check if the component is in edit mode and populate event details if necessary

    this.eventForm.get('title').valueChanges.subscribe(() => {
      this.updateCharacterCount();
    });

    this.eventForm.get('description').valueChanges.subscribe(() => {
      this.updateCharacterCount();
    });
  }

  // Function to check if the component is in edit mode and fetch event details if necessary
  isEdit() {
    if (this.eventId !== null) {
      this.h1Text = 'update';
      // Get the details of the event with the provided ID
      this.eventService.getEventById(this.eventId).subscribe(
        (event) => {
          // Populate the component properties with the event details
          this.eventForm.setValue({
            title: event.title,
            description: event.description,
            startDate: moment(event.start_date).format('YYYY-MM-DD'),
            startTime: moment(event.start_date).format('HH:mm'),
            endDate: moment(event.end_date).format('YYYY-MM-DD'),
            endTime: moment(event.end_date).format('HH:mm'),
            allDay: event.allDay,
            backgroundColor: event.backgroundColor,
            borderColor: event.borderColor,
            textColor: event.textColor,
          });
        },
        (error) => {
          this.router.navigate(['/home']);
          console.log('Error fetching event details:', error);
        }
      );
    } else {
      this.h1Text = 'create';
    }
  }

  saveEvent() {
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

    if (this.eventId !== null) {
      this.eventService.updateEvent(event, this.eventId).subscribe(
        (res) => {
          console.log(res);
          this.router.navigate(['/home']);
          this.toastService.initiate({
            title: 'Event Updated',
            content: 'The event was updated successfully',
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
      this.eventService.newEvent(event).subscribe(
        (res) => {
          console.log(res);
          this.router.navigate(['/home']);
          this.toastService.initiate({
            title: 'Event Created',
            content: 'The event was created successfully',
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
          (res) => {
            console.log(res);
            this.router.navigate(['/home']);
            this.toastService.initiate({
              title: 'Event Deleted',
              content: 'The event was deleted successfully',
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

  // Function to combine date and time
  combineDateAndTime(date: string, time: string, allDay: boolean) {
    if (allDay) {
      return moment(`${date}T${`00:00`}`).format('YYYY-MM-DDTHH:mm');
    }
    return moment(`${date}T${time}`).format('YYYY-MM-DDTHH:mm');
  }

  updateCharacterCount() {
    this.titleCharacterCount = this.eventForm.get('title').value.length;
    this.descriptionCharacterCount =
      this.eventForm.get('description').value.length;
  }
}
