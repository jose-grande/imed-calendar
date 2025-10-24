import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CalendarEvent } from '../../models/calendar-event.model';
import { DatePipe } from '@angular/common';

interface DayColumn {
  date: Date;
  events: CalendarEvent[];
  isToday: boolean;
}

@Component({
  selector: 'app-week-view',
  imports: [
    DatePipe
  ],
  templateUrl: './week-view-component.html',
  styleUrl: './week-view-component.css'
})
export class WeekViewComponent implements OnChanges {
  @Input() currentDate!: Date;
  @Input() events: CalendarEvent[] = [];
  @Output() eventClick = new EventEmitter<CalendarEvent>();
  @Output() timeSlotClick = new EventEmitter<{ date: Date; hour: number }>();

  hours: number[] = Array.from({ length: 24 }, (_, i) => i);
  weekDays: DayColumn[] = [];
  ngOnChanges(changes: SimpleChanges): void {
    this.generateWeek();
  }
  private generateWeek(): void {
    const weekStart = this.getWeekStart(this.currentDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    this.weekDays = [];

    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + i);
      date.setHours(0, 0, 0, 0);

      const dayEvents = this.events.filter(event =>
        this.isSameDay(event.startTime, date)
      );

      this.weekDays.push({
        date: new Date(date),
        events: dayEvents,
        isToday: date.getTime() === today.getTime()
      });
    }
  }
  private getWeekStart(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day;
    return new Date(d.setDate(diff));
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

  onTimeSlotClick(date: Date, hour: number): void {
    this.timeSlotClick.emit({ date, hour });
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
