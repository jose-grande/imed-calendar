import { Component, OnInit } from '@angular/core';
import { CalendarEvent, ViewMode } from '../../models/calendar-event.model';
import { CalendarService } from '../../services/calendar.service';
import { AgendaViewComponent } from '../agenda-view-component/agenda-view-component';
import { DayViewComponent } from '../day-view-component/day-view-component';
import { MonthViewComponent } from '../month-view-component/month-view-component';
import { WeekViewComponent } from '../week-view-component/week-view-component';
import { EventModalComponent } from '../event-modal-component/event-modal-component';

@Component({
  selector: 'app-calendar',
  imports: [
    AgendaViewComponent,
    DayViewComponent,
    MonthViewComponent,
    WeekViewComponent,
    EventModalComponent
  ],
  templateUrl: './calendar-component.html',
  styleUrl: './calendar-component.css'
})
export class CalendarComponent implements OnInit {
  viewMode: ViewMode = 'month';
  currentDate: Date = new Date();
  events: CalendarEvent[] = [];
  selectedEvent: CalendarEvent | null = null;
  showEventModal = false;
  isEditMode = false;

  constructor(private calendarService: CalendarService) { }

  ngOnInit(): void {
    this.calendarService.getEvents().subscribe(events => {
      this.events = events;
    });

    this.calendarService.getSelectedDate().subscribe(date => {
      this.currentDate = date;
    });
  }

  changeView(mode: ViewMode): void {
    this.viewMode = mode;
  }

  previousPeriod(): void {
    const newDate = new Date(this.currentDate);
    switch (this.viewMode) {
      case 'day':
        newDate.setDate(newDate.getDate() - 1);
        break;
      case 'week':
        newDate.setDate(newDate.getDate() - 7);
        break;
      case 'month':
      case 'agenda':
        newDate.setMonth(newDate.getMonth() - 1);
        break;
    }
    this.currentDate = newDate;
    this.calendarService.setSelectedDate(newDate);
  }

  nextPeriod(): void {
    const newDate = new Date(this.currentDate);
    switch (this.viewMode) {
      case 'day':
        newDate.setDate(newDate.getDate() + 1);
        break;
      case 'week':
        newDate.setDate(newDate.getDate() + 7);
        break;
      case 'month':
      case 'agenda':
        newDate.setMonth(newDate.getMonth() + 1);
        break;
    }
    this.currentDate = newDate;
    this.calendarService.setSelectedDate(newDate);
  }

  today(): void {
    this.currentDate = new Date();
    this.calendarService.setSelectedDate(this.currentDate);
  }

  openNewEventModal(date?: Date, hour?: number): void {
    const startTime = date ? new Date(date) : new Date(this.currentDate);
    if (hour !== undefined) {
      startTime.setHours(hour, 0, 0, 0);
    }

    const endTime = new Date(startTime);
    endTime.setHours(startTime.getHours() + 1);

    this.selectedEvent = {
      id: Date.now().toString(),
      title: '',
      description: '',
      startTime,
      endTime,
      location: '',
      color: '#4285F4'
    };
    this.isEditMode = false;
    this.showEventModal = true;
  }

  openEditEventModal(event: CalendarEvent): void {
    this.selectedEvent = { ...event };
    this.isEditMode = true;
    this.showEventModal = true;
  }

  closeEventModal(): void {
    this.showEventModal = false;
    this.selectedEvent = null;
    this.isEditMode = false;
  }

  saveEvent(event: CalendarEvent): void {
    if (this.isEditMode) {
      this.calendarService.updateEvent(event);
    } else {
      this.calendarService.addEvent(event);
    }
    this.closeEventModal();
  }

  deleteEvent(eventId: string): void {
    if (confirm('Are you sure you want to delete this event?')) {
      this.calendarService.deleteEvent(eventId);
      this.closeEventModal();
    }
  }

  getCurrentPeriodLabel(): string {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long'
    };

    switch (this.viewMode) {
      case 'day':
        return this.currentDate.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      case 'week':
        const weekStart = this.getWeekStart(this.currentDate);
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 6);
        return `${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
      case 'month':
      case 'agenda':
        return this.currentDate.toLocaleDateString('en-US', options);
      default:
        return '';
    }
  }

  private getWeekStart(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day;
    return new Date(d.setDate(diff));
  }
}
