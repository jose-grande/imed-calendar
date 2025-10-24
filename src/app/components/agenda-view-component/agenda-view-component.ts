import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CalendarEvent } from '../../models/calendar-event.model';
import { DatePipe } from '@angular/common';
interface AgendaGroup {
  date: Date;
  events: CalendarEvent[];
}
@Component({
  selector: 'app-agenda-view',
  imports: [
    DatePipe
  ],
  templateUrl: './agenda-view-component.html',
  styleUrl: './agenda-view-component.css'
})
export class AgendaViewComponent implements OnChanges {
  @Input() currentDate!: Date;
  @Input() events: CalendarEvent[] = [];
  @Output() eventClick = new EventEmitter<CalendarEvent>();

  agendaGroups: AgendaGroup[] = [];
  filterMode: 'day' | 'week' | 'month' = 'month';
  ngOnChanges(changes: SimpleChanges): void {
    this.filterEvents();
  }
  changeFilter(mode: 'day' | 'week' | 'month'): void {
    this.filterMode = mode;
    this.filterEvents();
  }

  private filterEvents(): void {
    let filteredEvents: CalendarEvent[] = [];

    switch (this.filterMode) {
      case 'day':
        filteredEvents = this.events.filter(event =>
          this.isSameDay(event.startTime, this.currentDate)
        );
        break;
      case 'week':
        const weekStart = this.getWeekStart(this.currentDate);
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 6);
        weekEnd.setHours(23, 59, 59, 999);
        filteredEvents = this.events.filter(event =>
          event.startTime >= weekStart && event.startTime <= weekEnd
        );
        break;
      case 'month':
        const monthStart = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
        const monthEnd = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0, 23, 59, 59, 999);
        filteredEvents = this.events.filter(event =>
          event.startTime >= monthStart && event.startTime <= monthEnd
        );
        break;
    }

    // Sort events by start time
    filteredEvents.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());

    // Group events by date
    const groups: Map<string, CalendarEvent[]> = new Map();

    filteredEvents.forEach(event => {
      const dateKey = this.getDateKey(event.startTime);
      if (!groups.has(dateKey)) {
        groups.set(dateKey, []);
      }
      groups.get(dateKey)!.push(event);
    });

    this.agendaGroups = Array.from(groups.entries()).map(([key, events]) => ({
      date: events[0].startTime,
      events
    }));
  }

  private getDateKey(date: Date): string {
    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
  }

  private isSameDay(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate();
  }

  private getWeekStart(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day;
    const weekStart = new Date(d.setDate(diff));
    weekStart.setHours(0, 0, 0, 0);
    return weekStart;
  }

  onEventClick(event: CalendarEvent): void {
    this.eventClick.emit(event);
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return this.isSameDay(date, today);
  }
}
