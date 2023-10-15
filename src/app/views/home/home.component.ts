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
  @ViewChild('calendar') calendarComponent: FullCalendarComponent;
  events: any[] = [];
  options: CalendarOptions;

  constructor(
    private eventService: EventService,
    private toastService: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.chargeEvents();

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

  chargeEvents() {
    this.eventService.getAllEvents().subscribe(
      (eventsObtained: Event[]) => {
        this.events = eventsObtained.map((event: Event) => ({
          id: event.id,
          title: event.title,
          start: event.start,
          end: event.end,
          allDay: event.allDay,
          backgroundColor: event.backgroundColor,
          borderColor: event.borderColor,
          textColor: event.textColor,
        }));
      },
      (err) => {
        console.error(err);
        this.toastService.initiate({
          title: 'Error',
          content: 'Error fetching the events',
        });
      }
    );
  }

  handleEventDrop(eventInfo: any) {
    const updatedEvent: Event = {
      start: eventInfo.event.start,
      end: eventInfo.event.end,
      allDay: eventInfo.event.allDay,
    };

    this.eventService.updateEvent(updatedEvent, eventInfo.event.id).subscribe(
      (res) => {
        console.log(res);
      },
      (err) => {
        this.toastService.initiate({
          title: 'Error',
          content: err.error.message,
        });
        console.error(err);
      }
    );
  }

  handleEventClick(eventInfo: any) {
    this.router.navigate(['/edit-event/' + eventInfo.event.id]);
  }

  handleEventResize(eventInfo: any) {
    const updatedEvent: Event = {
      start: eventInfo.event.start,
      end: eventInfo.event.end,
      allDay: eventInfo.event.allDay,
    };

    this.eventService.updateEvent(updatedEvent, eventInfo.event.id).subscribe(
      (res) => {
        console.log(res);
      },
      (err) => {
        this.toastService.initiate({
          title: 'Error',
          content: err.error.message,
        });
        console.error(err);
      }
    );
  }
}
