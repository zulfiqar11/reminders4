import { ReminderService } from './../shared/services/reminder.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Reminder } from '../shared/model/reminder';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';

enum FREQUENCY {
  Once = "Once",
  Weekly = "Weekly",
  Monthly = "Monthly",
  Yearly = "Yearly"
};

enum WEEKDAY {
  Monday = "Monday",
  Tuesday = "Tuesday",
  Wednesday = "Wednesday",
  Thursday = "Thursday",
  Friday = "Friday",
  Saturday = "Saturday",
  Sunday = "Sunday"
};

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
  message = new FormControl("");

  date = new FormControl("");
  weekday = new FormControl("");
  day = new FormControl("");
  month = new FormControl("");


  constructor(fb: FormBuilder,private reminderService: ReminderService, private datePipe: DatePipe) {
    this.form = fb.group(
      {
        "id": this.id,
        "firstName": this.firstName,
        "lastName": this.lastName,
        "phoneNumber": this.phoneNumber,
        "emailAddress": this.emailAddress,
        "frequency": this.frequency,
        "time": this.time,
        "message": this.message
      }
    )
  }

  ngOnInit(): void {
    this.remindersList$ = this.reminderService.getReminders();
    this.firstName.disable();
    this.lastName.disable();
    this.emailAddress.disable();
    this.phoneNumber.disable();
  }

  selectReminder(reminder: Reminder) {
    this.populateReminderControl(reminder);
  }

  populateReminderControl(reminder: Reminder) {

    this.form.removeControl('date');
    this.form.removeControl('weekday');
    this.form.removeControl('day');
    this.form.removeControl('month');

    this.form.patchValue({
      id: reminder.id,
      firstName : reminder.firstName,
      lastName : reminder.lastName,
      emailAddress : reminder.emailAddress,
      phoneNumber : reminder.phoneNumber,
      frequency: reminder.frequency,
      time: reminder.time,
      message: reminder.message
    });

    if (reminder.frequency === FREQUENCY.Once) {
      this.form.addControl('date', this.date);
      this.form.patchValue({date: new Date(reminder.date!).toISOString()});
    }

    if (reminder.frequency === FREQUENCY.Weekly) {
      this.form.addControl('weekday', this.weekday);
      this.form.patchValue({weekday: reminder.weekday});
    }

    if (reminder.frequency === FREQUENCY.Monthly) {
      this.form.addControl('day', this.day);
      this.form.patchValue({day: reminder.day});
    }

    if (reminder.frequency === FREQUENCY.Yearly) {
      this.form.addControl('month', this.month);
      this.form.patchValue({month: reminder.month});

      this.form.addControl('day', this.day);
      this.form.patchValue({day: reminder.day});
    }

  }

  onUpdate() {
    this.spin = true;
    let reminder = this.populateReminder();
    this.reminderService.update(reminder).subscribe(() => this.spin = false);
    this.remindersList$ = this.reminderService.getReminders();
  }

  populateReminder(): Reminder {
    let reminder: Reminder =  {
      id: this.form.controls.id.value,
      firstName: this.form.controls.firstName.value,
      lastName: this.form.controls.lastName.value,
      emailAddress: this.form.controls.emailAddress.value,
      phoneNumber: this.form.controls.phoneNumber.value,
      frequency: this.form.controls.frequency.value,
      time: this.form.controls.time.value,
      message: this.form.controls.message.value
    }

    if (reminder.frequency === FREQUENCY.Once) {
      return {...reminder, date: this.datePipe.transform(this.form.controls.date.value, 'MM/dd/yyyy')}
    }
    if (reminder.frequency === FREQUENCY.Weekly) {
      return {...reminder, weekday: this.form.controls.weekday.value}
    }
    if (reminder.frequency === FREQUENCY.Monthly) {
      return {...reminder, day: this.form.controls.day.value}
    }
    if (reminder.frequency === FREQUENCY.Yearly) {
      return {...reminder, day: this.form.controls.day.value, month: this.form.controls.month.value}
    }
    return reminder;
  }
}
