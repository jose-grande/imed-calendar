import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CalendarEvent } from '../models/calendar-event.model';


@Injectable({
  providedIn: 'root'
})
export class CalendarService {
  private events$ = new BehaviorSubject<CalendarEvent[]>([]);
  private selectedDate$ = new BehaviorSubject<Date>(new Date());

  constructor() {
    this.loadMockData();
  }

  getEvents(): Observable<CalendarEvent[]> {
    return this.events$.asObservable();
  }

  getSelectedDate(): Observable<Date> {
    return this.selectedDate$.asObservable();
  }

  setSelectedDate(date: Date): void {
    this.selectedDate$.next(date);
  }

  addEvent(event: CalendarEvent): void {
    const currentEvents = this.events$.value;
    this.events$.next([...currentEvents, event]);
  }

  updateEvent(updatedEvent: CalendarEvent): void {
    const currentEvents = this.events$.value;
    const index = currentEvents.findIndex(e => e.id === updatedEvent.id);
    if (index !== -1) {
      currentEvents[index] = updatedEvent;
      this.events$.next([...currentEvents]);
    }
  }

  deleteEvent(eventId: string): void {
    const currentEvents = this.events$.value;
    this.events$.next(currentEvents.filter(e => e.id !== eventId));
  }

  getEventsByDate(date: Date): CalendarEvent[] {
    const events = this.events$.value;
    return events.filter(event => this.isSameDay(event.startTime, date));
  }

  getEventsByDateRange(startDate: Date, endDate: Date): CalendarEvent[] {
    const events = this.events$.value;
    return events.filter(event => {
      const eventDate = event.startTime;
      return eventDate >= startDate && eventDate <= endDate;
    });
  }

  private isSameDay(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  }

  private loadMockData(): void {
    const mockEvents: CalendarEvent[] = [
      {
        id: '1',
        title: 'Team Meeting',
        description: 'Weekly team sync-up',
        startTime: new Date(2025, 9, 16, 10, 0),
        endTime: new Date(2025, 9, 16, 11, 0),
        location: 'Conference Room A',
        color: '#4285F4'
      },
      {
        id: '2',
        title: 'Lunch with Client',
        description: 'Discuss project requirements',
        startTime: new Date(2025, 9, 16, 12, 30),
        endTime: new Date(2025, 9, 16, 13, 30),
        location: 'Downtown Restaurant',
        color: '#EA4335'
      },
      {
        id: '3',
        title: 'Project Review',
        description: 'Q4 project review',
        startTime: new Date(2025, 9, 17, 14, 0),
        endTime: new Date(2025, 9, 17, 16, 0),
        location: 'Zoom Meeting',
        color: '#34A853'
      },
      {
        id: '4',
        title: 'Code Review',
        description: 'Review new feature implementation',
        startTime: new Date(2025, 9, 18, 9, 0),
        endTime: new Date(2025, 9, 18, 10, 30),
        location: 'Office',
        color: '#FBBC04'
      },
      {
        id: '5',
        title: 'Training Session',
        description: 'Angular best practices workshop',
        startTime: new Date(2025, 9, 20, 13, 0),
        endTime: new Date(2025, 9, 20, 17, 0),
        location: 'Training Room',
        color: '#9C27B0'
      }
    ];
    this.events$.next(mockEvents);
  }
}