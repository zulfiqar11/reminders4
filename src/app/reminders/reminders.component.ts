import { ReminderService } from './../shared/services/reminder.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Reminder } from '../shared/model/reminder';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';

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

    if (reminder.frequency === 'Once') {
      this.form.addControl('date', this.date);
      let date1 =  new Date(reminder.date!).toISOString();
      this.form.patchValue({date: date1});
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

    if (reminder.frequency === 'Once') {
      return {...reminder, date: this.datePipe.transform(this.form.controls.date.value, 'MM/dd/yyyy')}
    }
    return reminder;
  }
}
