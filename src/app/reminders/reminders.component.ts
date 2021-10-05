import { ReminderService } from './../shared/services/reminder.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Reminder } from '../shared/model/reminder';

@Component({
  selector: 'app-reminders',
  templateUrl: './reminders.component.html',
  styleUrls: ['./reminders.component.css']
})
export class RemindersComponent implements OnInit {

  remindersList$!: Observable<Reminder[]>;
  spin = false;

  displayedColumns: string[] = ['id', 'firstName', 'lastName', 'phoneNumber', 'emailAddress', 'frequency', 'month',  'day', 'weekday',  'time', 'date','message'];

  constructor(private reminderService: ReminderService) { }

  ngOnInit(): void {
    this.remindersList$ = this.reminderService.getReminders();
  }

  selectReminder(reminder: Reminder) {
    // this.populateFormControl(contact);
  }


}
