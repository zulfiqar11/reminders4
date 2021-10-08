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
    reminder.date? this.form.addControl('date', this.date) : this.form.removeControl('date');
    this.populateReminderControl(reminder);

  }

  populateReminderControl(reminder: Reminder) {
    let date1 =  reminder.date? (new Date(reminder.date? reminder.date: "").toISOString()) : ""
    date1? this.form.patchValue({date: date1}): "";
    this.form.patchValue({
      id: reminder.id,
      firstName : reminder.firstName,
      lastName : reminder.lastName,
      emailAddress : reminder.emailAddress,
      phoneNumber : reminder.phoneNumber,
      frequency: reminder.frequency,
      time: reminder.time,
      message: reminder.message
    })
  }

  onUpdate() {
    this.spin = true;
    let reminder = this.populateReminder();
    this.reminderService.update(reminder).subscribe(() => this.spin = false);
    this.remindersList$ = this.reminderService.getReminders();
  }

  populateReminder(): Reminder {
    let dateValue = this.datePipe.transform(this.form.controls.date.value, 'MM/dd/yyyy')

    return {
      id: this.form.controls.id.value,
      firstName: this.form.controls.firstName.value,
      lastName: this.form.controls.lastName.value,
      emailAddress: this.form.controls.emailAddress.value,
      phoneNumber: this.form.controls.phoneNumber.value,
      date: (dateValue? dateValue: ""),
      frequency: this.form.controls.frequency.value,
      time: this.form.controls.time.value,
      message: this.form.controls.message.value
    }
  }
}
