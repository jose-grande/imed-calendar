export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  location: string;
  color?: string;
}

export type ViewMode = 'month' | 'week' | 'day' | 'agenda';