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
  MonthWeekly = "MonthWeekly",
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

  selectedFrequency: string = "";
  remindersList$!: Observable<Reminder[]>;
  spin = false;

  displayedColumns: string[] = ['id', 'firstName', 'lastName', 'phoneNumber', 'emailAddress', 'frequency', 'month',  'day', 'week',  'weekday',  'time', 'date','message'];

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
  week = new FormControl("");


  constructor(fb: FormBuilder,private reminderService: ReminderService, private datePipe: DatePipe) {
    this.form = fb.group(
      {
        id: this.id,
        firstName: this.firstName,
        lastName: this.lastName,
        phoneNumber: this.phoneNumber,
        emailAddress: this.emailAddress,
        frequency: this.frequency,
        time: this.time,
        message: this.message
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

    this.removeControls();

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

    if (reminder.frequency === FREQUENCY.MonthWeekly) {
      this.form.addControl('week', this.week);
      this.form.patchValue({week: reminder.week});
      this.form.addControl('weekday', this.weekday);
      this.form.patchValue({weekday: reminder.weekday});
    }
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
    if (reminder.frequency === FREQUENCY.MonthWeekly) {
      return {...reminder, week: this.form.controls.week.value, weekday: this.form.controls.weekday.value}
    }
    if (reminder.frequency === FREQUENCY.Yearly) {
      return {...reminder, day: this.form.controls.day.value, month: this.form.controls.month.value}
    }
    return reminder;
  }

  onUpdate() {
    this.spin = true;
    let reminder = this.populateReminder();
    this.reminderService.update(reminder).subscribe(() => this.spin = false);
    this.remindersList$ = this.reminderService.getReminders();
  }

  onDelete() {
    this.spin = true;
    let reminder = this.populateReminder();
    this.reminderService.delete(reminder).subscribe(() => this.spin = false);
    this.remindersList$ = this.reminderService.getReminders();
  }

  onNew() {
    this.emptyOutForm();
    this.removeControls();
  }

  emptyOutForm() {
    if (this.form.controls.frequency.value === FREQUENCY.Once) {
      this.form.controls.date.setValue("");
    }
    if (this.form.controls.frequency.value === FREQUENCY.Weekly) {
      this.form.controls.weekday.setValue("");
    }
    if (this.form.controls.frequency.value === FREQUENCY.Monthly) {
      this.form.controls.day.setValue("");
    }
    if (this.form.controls.frequency.value === FREQUENCY.MonthWeekly) {
      this.form.controls.week.setValue("");
      this.form.controls.weekday.setValue("");
    }
    if (this.form.controls.frequency.value === FREQUENCY.Yearly) {
      this.form.controls.month.setValue("");
      this.form.controls.day.setValue("");
    }

    this.form.controls.id.setValue("");
    this.form.controls.frequency.setValue("");
    this.form.controls.time.setValue("");
    this.form.controls.message.setValue("");
  }

  onAdd() {
    this.spin = true;
    this.reminderService.getReminders().subscribe(reminders => {
      let reminder = this.populateReminder();
      let maxId = reminders[reminders.length - 1].id + 1;
      reminder.id = maxId;
      this.reminderService.create(reminder).subscribe(() => this.spin = false);
      this.remindersList$ = this.reminderService.getReminders();
    })
  }

  removeControls() {
    this.form.removeControl('date');
    this.form.removeControl('weekday');
    this.form.removeControl('day');
    this.form.removeControl('month');
    this.form.removeControl('week');
  }

  selectFrequency(event: Event) {
    this.selectedFrequency = (event.target as HTMLSelectElement).value;

    this.removeControls();

    if (this.selectedFrequency === FREQUENCY.Once) {
      this.form.addControl('date', this.date);
    }

    if (this.selectedFrequency === FREQUENCY.Weekly) {
      this.form.addControl('weekday', this.weekday);
    }

    if (this.selectedFrequency === FREQUENCY.Monthly) {
      this.form.addControl('day', this.day);
    }

    if (this.selectedFrequency === FREQUENCY.MonthWeekly) {
      this.form.addControl('week', this.week);
      this.form.addControl('weekday', this.weekday);
    }

    if (this.selectedFrequency === FREQUENCY.Yearly) {
      this.form.addControl('month', this.month);
      this.form.addControl('day', this.day);
    }
  }


}
