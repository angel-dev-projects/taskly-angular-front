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
    this.eventId = this.activatedRoute.snapshot.paramMap.get('id');

    this.eventForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      startDate: [format(new Date(), 'yyyy-MM-dd'), Validators.required],  // Utiliza date-fns en lugar de moment
      startTime: [format(new Date(), 'HH:mm')],
      endDate: [format(new Date(), 'yyyy-MM-dd'), Validators.required],  // Utiliza date-fns en lugar de moment
      endTime: [format(new Date(), 'HH:mm')],
      allDay: [false],
      backgroundColor: ['#0000FF', Validators.required],
      borderColor: ['#ff1414', Validators.required],
      textColor: ['#ffffff', Validators.required],
    });
  }

  ngOnInit() {
    this.isEdit();

    this.eventForm.get('title').valueChanges.subscribe(() => {
      this.updateCharacterCount();
    });

    this.eventForm.get('description').valueChanges.subscribe(() => {
      this.updateCharacterCount();
    });
  }

  isEdit() {
    if (this.eventId !== null) {
      this.h1Text = 'update';
      this.eventService.getEventById(this.eventId).subscribe(
        (event) => {
          this.eventForm.setValue({
            title: event.title,
            description: event.description,
            startDate: format(new Date(event.start_date), 'yyyy-MM-dd'),  // Formatea la fecha al asignarla al formulario
            startTime: format(new Date(event.start_date), 'HH:mm'),
            endDate: format(new Date(event.end_date), 'yyyy-MM-dd'),  // Formatea la fecha al asignarla al formulario
            endTime: format(new Date(event.end_date), 'HH:mm'),
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

  combineDateAndTime(date: string, time: string, allDay: boolean) {
    const dateTimeString = allDay ? `${date}T00:00` : `${date}T${time}`;
    return format(new Date(dateTimeString), 'yyyy-MM-dd HH:mm');
  }
  

  updateCharacterCount() {
    this.titleCharacterCount = this.eventForm.get('title').value.length;
    this.descriptionCharacterCount =
      this.eventForm.get('description').value.length;
  }
}
