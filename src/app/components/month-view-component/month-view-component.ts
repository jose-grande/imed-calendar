import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CalendarEvent } from '../../models/calendar-event.model';
import { DatePipe } from '@angular/common';

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  events: CalendarEvent[];
}

@Component({
  selector: 'app-month-view',
  imports: [
    DatePipe
  ],
  templateUrl: './month-view-component.html',
  styleUrl: './month-view-component.css'
})
export class MonthViewComponent implements OnChanges {
  @Input() currentDate!: Date;
  @Input() events: CalendarEvent[] = [];
  @Output() eventClick = new EventEmitter<CalendarEvent>();
  @Output() dateClick = new EventEmitter<Date>();

  weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  calendarDays: CalendarDay[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    this.generateCalendar();
  }
  private generateCalendar(): void {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - startDate.getDay());

    const days: CalendarDay[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      date.setHours(0, 0, 0, 0);

      const dayEvents = this.events.filter(event =>
        this.isSameDay(event.startTime, date)
      );

      days.push({
        date: new Date(date),
        isCurrentMonth: date.getMonth() === month,
        isToday: date.getTime() === today.getTime(),
        events: dayEvents
      });
    }

    this.calendarDays = days;
  }
  private isSameDay(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate();
  }

  onEventClick(event: CalendarEvent, e: Event): void {
    e.stopPropagation();
    this.eventClick.emit(event);
  }

  onDateClick(date: Date): void {
    this.dateClick.emit(date);
  }
}
