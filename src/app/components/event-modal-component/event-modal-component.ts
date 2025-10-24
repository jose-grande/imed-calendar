import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CalendarEvent } from '../../models/calendar-event.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-event-modal',
  imports: [
    FormsModule
  ],
  templateUrl: './event-modal-component.html',
  styleUrl: './event-modal-component.css'
})
export class EventModalComponent implements OnInit {
  @Input() event: CalendarEvent | null = null;
  @Input() isEditMode = false;
  @Output() save = new EventEmitter<CalendarEvent>();
  @Output() delete = new EventEmitter<string>();
  @Output() close = new EventEmitter<void>();
  formData: any = {
    title: '',
    description: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    location: '',
    color: '#4285F4'
  };

  colors = [
    { value: '#4285F4', name: 'Blue' },
    { value: '#EA4335', name: 'Red' },
    { value: '#34A853', name: 'Green' },
    { value: '#FBBC04', name: 'Yellow' },
    { value: '#9C27B0', name: 'Purple' },
    { value: '#FF6D00', name: 'Orange' },
    { value: '#00BCD4', name: 'Cyan' },
    { value: '#E91E63', name: 'Pink' }
  ];
  ngOnInit(): void {
    if (this.event) {
      this.formData = {
        title: this.event.title,
        description: this.event.description,
        startDate: this.formatDateForInput(this.event.startTime),
        startTime: this.formatTimeForInput(this.event.startTime),
        endDate: this.formatDateForInput(this.event.endTime),
        endTime: this.formatTimeForInput(this.event.endTime),
        location: this.event.location,
        color: this.event.color || '#4285F4'
      };
    }
  }

  private formatDateForInput(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private formatTimeForInput(date: Date): string {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  onSubmit(): void {
    if (!this.formData.title.trim()) {
      alert('Please enter an event title');
      return;
    }

    const startDateTime = new Date(`${this.formData.startDate}T${this.formData.startTime}`);
    const endDateTime = new Date(`${this.formData.endDate}T${this.formData.endTime}`);

    if (endDateTime <= startDateTime) {
      alert('End time must be after start time');
      return;
    }

    const eventData: CalendarEvent = {
      id: this.event?.id || Date.now().toString(),
      title: this.formData.title,
      description: this.formData.description,
      startTime: startDateTime,
      endTime: endDateTime,
      location: this.formData.location,
      color: this.formData.color
    };

    this.save.emit(eventData);
  }

  onDelete(): void {
    if (this.event) {
      this.delete.emit(this.event.id);
    }
  }

  onClose(): void {
    this.close.emit();
  }

  onOverlayClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }
}
