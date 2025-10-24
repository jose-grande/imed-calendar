import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CalendarComponent } from "./components/calendar-component/calendar-component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CalendarComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('ImedCalendarV2');
}
