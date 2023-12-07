// Import necessary modules and services
import { Component, OnInit, ViewChild } from '@angular/core';
import { EventService } from 'src/app/services/event.service';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import { ToastService } from 'src/app/services/toast.service';
import { Event } from 'src/app/interfaces/event.interface';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  // Reference to the FullCalendar component
  @ViewChild('calendar') calendarComponent: FullCalendarComponent;

  // Array to store events retrieved from the backend
  events: any[] = [];

  // Configuration options for FullCalendar
  options: CalendarOptions;

  constructor(
    // Inject EventService for fetching event data, ToastService for displaying notifications, and Router for navigation
    private eventService: EventService,
    private toastService: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Initialize the component by fetching and displaying events
    this.chargeEvents();

    // Configure FullCalendar options
    this.options = {
      plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin],
      navLinks: true,
      editable: true,
      selectMirror: true,
      dayMaxEvents: true,
      eventDrop: this.handleEventDrop.bind(this),
      eventClick: this.handleEventClick.bind(this),
      eventResize: this.handleEventResize.bind(this),
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
      },
      eventTimeFormat: {
        hour: '2-digit',
        minute: '2-digit',
      },
    };
  }

  // Function to fetch all events from the EventService
  chargeEvents() {
    this.eventService.getAllEvents().subscribe(
      // Success callback
      (eventsObtained: Event[]) => {
        // Map the obtained events to a simplified format for FullCalendar
        this.events = eventsObtained.map((event: Event) => ({
          id: event.id,
          title: event.title,
          start: event.start_date,
          end: event.end_date,
          allDay: event.allDay,
          backgroundColor: event.backgroundColor,
          borderColor: event.borderColor,
          textColor: event.textColor,
        }));
      },
      // Error callback
      (err) => {
        // Log the error and display a toast notification
        console.error(err);
        this.toastService.initiate({
          title: 'Error',
          content: 'Error fetching the events',
        });
      }
    );
  }

  // Handler for when an event is dropped on the calendar
  handleEventDrop(eventInfo: any) {
    // Prepare the updated event data
    const updatedEvent: Event = {
      start_date: eventInfo.event.start,
      end_date: eventInfo.event.end !== null ? eventInfo.event.end : eventInfo.event.start,
      allDay: eventInfo.event.allDay,
    };

    // Update the event on the backend
    this.eventService.updateEvent(updatedEvent, eventInfo.event.id).subscribe(
      // Success callback
      (res) => {
        console.log(res);
      },
      // Error callback
      (err) => {
        // Display a toast notification for the error
        this.toastService.initiate({
          title: 'Error',
          content: err.error.message,
        });
        console.error(err);
      }
    );
  }

  // Handler for when an event is clicked
  handleEventClick(eventInfo: any) {
    // Navigate to the edit-event route with the event id as a parameter
    this.router.navigate(['/edit-event/' + eventInfo.event.id]);
  }

  // Handler for when an event is resized
  handleEventResize(eventInfo: any) {
    // Prepare the updated event data
    const updatedEvent: Event = {
      start_date: eventInfo.event.start,
      end_date: eventInfo.event.end,
      allDay: eventInfo.event.allDay,
    };

    // Update the event on the backend
    this.eventService.updateEvent(updatedEvent, eventInfo.event.id).subscribe(
      // Success callback
      (res) => {
        console.log(res);
      },
      // Error callback
      (err) => {
        // Display a toast notification for the error
        this.toastService.initiate({
          title: 'Error',
          content: err.error.message,
        });
        console.error(err);
      }
    );
  }
}
