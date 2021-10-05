import { ReminderService } from './../shared/services/reminder.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Reminder } from '../shared/model/reminder';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-reminders',
  templateUrl: './reminders.component.html',
  styleUrls: ['./reminders.component.css']
})
export class RemindersComponent implements OnInit {

  remindersList$!: Observable<Reminder[]>;
  spin = false;

  displayedColumns: string[] = ['id', 'firstName', 'lastName', 'phoneNumber', 'emailAddress', 'frequency', 'month',  'day', 'weekday',  'time', 'date','message'];

  form!: FormGroup;
  id = new FormControl("");
  firstName = new FormControl("", Validators.required);
  lastName = new FormControl("", Validators.required);
  emailAddress = new FormControl("", Validators.required);
  phoneNumber = new FormControl("", Validators.required);
  frequency = new FormControl("");
  time = new FormControl("");
  date = new FormControl("");
  message = new FormControl("");


  constructor(fb: FormBuilder,private reminderService: ReminderService) {
    this.form = fb.group(
      {
        "id": this.id,
        "firstName": this.firstName,
        "lastName": this.lastName,
        "phoneNumber": this.phoneNumber,
        "emailAddress": this.emailAddress,
        "frequency": this.frequency,
        "time": this.time,
        "date": this.date,
        "message": this.message
      }
    )
  }

  ngOnInit(): void {
    this.remindersList$ = this.reminderService.getReminders();
  }

  selectReminder(reminder: Reminder) {
    this.populateReminderControl(reminder);
  }

  populateReminderControl(reminder: Reminder) {
    this.form.patchValue({
      id: reminder.id,
      firstName : reminder.firstName,
      lastName : reminder.lastName,
      emailAddress : reminder.emailAddress,
      phoneNumber : reminder.phoneNumber,
      frequency: reminder.frequency,
      time: reminder.time,
      date: reminder.date,
      message: reminder.message
    })
  }

  onUpdate() {

  }


}
