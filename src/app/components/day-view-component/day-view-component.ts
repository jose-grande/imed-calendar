import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CalendarEvent } from '../../models/calendar-event.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-day-view',
  imports: [
    DatePipe
  ],
  templateUrl: './day-view-component.html',
  styleUrl: './day-view-component.css'
})
export class DayViewComponent implements OnChanges {
  @Input() currentDate!: Date;
  @Input() events: CalendarEvent[] = [];
  @Output() eventClick = new EventEmitter<CalendarEvent>();
  @Output() timeSlotClick = new EventEmitter<number>();

  hours: number[] = Array.from({ length: 24 }, (_, i) => i);
  dayEvents: CalendarEvent[] = [];

  ngOnChanges(): void {
    this.filterDayEvents();
  }

  private filterDayEvents(): void {
    this.dayEvents = this.events.filter(event => 
      this.isSameDay(event.startTime, this.currentDate)
    );
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

  onTimeSlotClick(hour: number): void {
    this.timeSlotClick.emit(hour);
  }

  getEventStyle(event: CalendarEvent): any {
    const startHour = event.startTime.getHours();
    const startMinute = event.startTime.getMinutes();
    const endHour = event.endTime.getHours();
    const endMinute = event.endTime.getMinutes();
    
    const top = (startHour * 60 + startMinute) / 60 * 60;
    const duration = ((endHour * 60 + endMinute) - (startHour * 60 + startMinute)) / 60;
    const height = duration * 60;

    return {
      top: `${top}px`,
      height: `${height}px`,
      'background-color': event.color
    };
  }

  formatHour(hour: number): string {
    if (hour === 0) return '12 AM';
    if (hour < 12) return `${hour} AM`;
    if (hour === 12) return '12 PM';
    return `${hour - 12} PM`;
  }
}
