import { ContactService } from './../shared/services/contact.service';
import { ReminderService } from './../shared/services/reminder.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Reminder } from '../shared/model/reminder';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { map } from 'rxjs/operators';
import { ContactDisplay } from '../shared/model/contact';

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

  remindersList$!: Observable<Reminder[]>;
  spin = false;

  displayedColumns: string[] = ['id', 'firstName', 'lastName', 'phoneNumber', 'emailAddress', 'frequency', 'month',  'day', 'week',  'weekday',  'time', 'date','message'];

  frequencies = [
    {value: 'Once', viewValue: 'Once'},
    {value: 'Daily', viewValue: 'Daily'},
    {value: 'Weekly', viewValue: 'Weekly'},
    {value: 'Monthly', viewValue: 'Monthly'},
    {value: 'MonthWeekly', viewValue: 'MonthWeekly'},
    {value: 'Yearly', viewValue: 'Yearly'}
  ];

  weeks = [
    {value: 'First', viewValue: 'First'},
    {value: 'Second', viewValue: 'Second'},
    {value: 'Third', viewValue: 'Third'},
    {value: 'Fourth', viewValue: 'Fourth'}
  ];

  weekdays = [
    {value: 'Monday', viewValue: 'Monday'},
    {value: 'Tuesday', viewValue: 'Tuesday'},
    {value: 'Wednesday', viewValue: 'Wednesday'},
    {value: 'Thursday', viewValue: 'Thursday'},
    {value: 'Friday', viewValue: 'Friday'},
    {value: 'Saturday', viewValue: 'Saturday'},
    {value: 'Sunday', viewValue: 'Sunday'}
  ];

  months = [
    {value: 'January', viewValue: 'January'},
    {value: 'February', viewValue: 'February'},
    {value: 'March', viewValue: 'March'},
    {value: 'April', viewValue: 'April'},
    {value: 'May', viewValue: 'May'},
    {value: 'June', viewValue: 'June'},
    {value: 'July', viewValue: 'July'},
    {value: 'August', viewValue: 'August'},
    {value: 'September', viewValue: 'September'},
    {value: 'October', viewValue: 'October'},
    {value: 'November', viewValue: 'November'},
    {value: 'December', viewValue: 'December'}
  ];

  days =  [] as any;

  contacts$!: Observable<ContactDisplay[]>;

  remindersForm!: FormGroup;
  id = new FormControl("");
  firstName = new FormControl("", Validators.required);
  lastName = new FormControl("", Validators.required);
  emailAddress = new FormControl("", Validators.required);
  phoneNumber = new FormControl("", Validators.required);
  frequency = new FormControl("", Validators.required);
  time = new FormControl("", Validators.required);
  message = new FormControl("", Validators.required);

  contactsList = new FormControl("");

  date = new FormControl("");
  weekday = new FormControl("");
  day = new FormControl("");
  month = new FormControl("");
  week = new FormControl("");

  reminderSelected = false;
  newState = false;
  cancelState = false;
  deleteState = false;

  constructor(fb: FormBuilder,private reminderService: ReminderService, private datePipe: DatePipe, private contactService: ContactService) {
    this.remindersForm = fb.group(
      {
        id: this.id,
        firstName: this.firstName,
        lastName: this.lastName,
        phoneNumber: this.phoneNumber,
        emailAddress: this.emailAddress,
        frequency: this.frequency,
        contactsList: this.contactsList,
        time: this.time,
        message: this.message
      }
    )



  }

  ngOnInit(): void {
    this.remindersList$ = this.reminderService.getReminders();

    this.contacts$ = this.contactService.getContacts()
    .pipe(
       map(contacts => {
         return contacts.map(contact =>
            (
             { value: contact.id.toString(), viewValue: contact.firstName + " " + contact.lastName + " | " + contact.phoneNumber }
            )
          )
      })
    )

    for (let i = 1; i < 32; i++) {
      let newDay = {
         value: i.toString(),
         viewValue: i.toString()
      };
      this.days.push(newDay);
    }

    let freqControl = this.remindersForm.get('frequency');
    freqControl?.valueChanges.subscribe(freq => {
      this.selectFrequency(freq);
    })

    let contactListControl = this.remindersForm.get('contactsList');
    contactListControl?.valueChanges.subscribe((contactId: string) => {
      this.selectContact(+contactId);
    })
  }

  selectReminder(reminder: Reminder) {
    this.remindersForm.removeControl('contactsList');
    this.populateReminderControl(reminder);

    this.reminderSelected = true;
    this.cancelState = false;
    this.deleteState = true;
    this.newState = true;

  }

  populateReminderControl(reminder: Reminder) {

    this.removeControls();

    this.remindersForm.patchValue({
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
      this.remindersForm.addControl('date', this.date);
      this.remindersForm.patchValue({date: new Date(reminder.date!).toISOString()});
    }

    if (reminder.frequency === FREQUENCY.Weekly) {
      this.remindersForm.addControl('weekday', this.weekday);
      this.remindersForm.patchValue({weekday: reminder.weekday});
    }

    if (reminder.frequency === FREQUENCY.Monthly) {
      this.remindersForm.addControl('day', this.day);
      this.remindersForm.patchValue({day: reminder.day});
    }

    if (reminder.frequency === FREQUENCY.Yearly) {
      this.remindersForm.addControl('month', this.month);
      this.remindersForm.patchValue({month: reminder.month});

      this.remindersForm.addControl('day', this.day);
      this.remindersForm.patchValue({day: reminder.day});
    }

    if (reminder.frequency === FREQUENCY.MonthWeekly) {
      this.remindersForm.addControl('week', this.week);
      this.remindersForm.patchValue({week: reminder.week});
      this.remindersForm.addControl('weekday', this.weekday);
      this.remindersForm.patchValue({weekday: reminder.weekday});
    }
  }

  populateReminder(): Reminder {
    let reminder: Reminder =  {
      id: this.remindersForm.controls.id.value,
      firstName: this.remindersForm.controls.firstName.value,
      lastName: this.remindersForm.controls.lastName.value,
      emailAddress: this.remindersForm.controls.emailAddress.value,
      phoneNumber: this.remindersForm.controls.phoneNumber.value,
      frequency: this.remindersForm.controls.frequency.value,
      time: this.remindersForm.controls.time.value,
      message: this.remindersForm.controls.message.value
    }

    if (!this.reminderSelected) {
      reminder.id = 0;
    }

    if (reminder.frequency === FREQUENCY.Once) {
      return {...reminder, date: this.datePipe.transform(this.remindersForm.controls.date.value, 'MM/dd/yyyy')}
    }
    if (reminder.frequency === FREQUENCY.Weekly) {
      return {...reminder, weekday: this.remindersForm.controls.weekday.value}
    }
    if (reminder.frequency === FREQUENCY.Monthly) {
      return {...reminder, day: this.remindersForm.controls.day.value}
    }
    if (reminder.frequency === FREQUENCY.MonthWeekly) {
      return {...reminder, week: this.remindersForm.controls.week.value, weekday: this.remindersForm.controls.weekday.value}
    }
    if (reminder.frequency === FREQUENCY.Yearly) {
      return {...reminder, day: this.remindersForm.controls.day.value, month: this.remindersForm.controls.month.value}
    }

    return reminder;
  }

  onSave() {

    let reminder = this.populateReminder();

    if (reminder.id === 0) {
      this.spin = true;
      this.reminderService.getReminders().subscribe(reminders => {
        reminder.id = reminders[reminders.length - 1].id + 1;
        this.reminderService.create(reminder).subscribe(() => this.spin = false);
        this.remindersList$ = this.reminderService.getReminders();
      })
    }
    else {
      this.spin = true;
      this.reminderService.update(reminder).subscribe(() => this.spin = false);
      this.remindersList$ = this.reminderService.getReminders();
    }

    this.cancelState = false;
  }

  onDelete() {
    this.spin = true;
    let reminder = this.populateReminder();
    this.reminderService.delete(reminder).subscribe(() => this.spin = false);
    this.remindersList$ = this.reminderService.getReminders();
  }

  onNew() {
    this.remindersForm.addControl('contactsList', this.contactsList);
    this.emptyOutForm();
    this.removeControls();
    this.reminderSelected = false;
    this.newState = true;
    this.cancelState = true;
  }

  onCancel() {
    this.emptyOutForm();
    this.removeControls();
  }

  emptyOutForm() {

    this.remindersForm.controls.id.setValue("");

    this.remindersForm.controls.firstName.setValue("");
    this.remindersForm.controls.lastName.setValue("");
    this.remindersForm.controls.emailAddress.setValue("");
    this.remindersForm.controls.phoneNumber.setValue("");

    this.remindersForm.controls.contactsList.setValue("");

    this.remindersForm.controls.frequency.setValue("");
    this.remindersForm.controls.time.setValue("");
    this.remindersForm.controls.message.setValue("");

    if (this.remindersForm.controls.frequency.value === FREQUENCY.Once) {
      this.remindersForm.controls.date.setValue("");
    }
    if (this.remindersForm.controls.frequency.value === FREQUENCY.Weekly) {
      this.remindersForm.controls.weekday.setValue("");
    }
    if (this.remindersForm.controls.frequency.value === FREQUENCY.Monthly) {
      this.remindersForm.controls.day.setValue("");
    }
    if (this.remindersForm.controls.frequency.value === FREQUENCY.MonthWeekly) {
      this.remindersForm.controls.week.setValue("");
      this.remindersForm.controls.weekday.setValue("");
    }
    if (this.remindersForm.controls.frequency.value === FREQUENCY.Yearly) {
      this.remindersForm.controls.month.setValue("");
      this.remindersForm.controls.day.setValue("");
    }

  }

  removeControls() {

    this.remindersForm.removeControl('date');
    this.remindersForm.removeControl('weekday');
    this.remindersForm.removeControl('day');
    this.remindersForm.removeControl('month');
    this.remindersForm.removeControl('week');
  }

  selectContact(contactId: number) {
    let contacts$ = this.contactService.getContacts().pipe(
      map(contacts => contacts.filter(contact => contact.id === contactId))
      ).subscribe(contacts => {
        this.remindersForm.patchValue({
          firstName : contacts[0].firstName,
          lastName : contacts[0].lastName,
          emailAddress : contacts[0].emailAddress,
          phoneNumber : contacts[0].phoneNumber
        });
    });
  }

  selectFrequency(freqSelected: string) {

    this.removeControls();

    if (freqSelected=== FREQUENCY.Once) {
      this.remindersForm.addControl('date', this.date);
    }

    if (freqSelected=== FREQUENCY.Weekly) {
      this.remindersForm.addControl('weekday', this.weekday);
    }

    if (freqSelected=== FREQUENCY.Monthly) {
      this.remindersForm.addControl('day', this.day);
    }

    if (freqSelected === FREQUENCY.MonthWeekly) {
      this.remindersForm.addControl('week', this.week);
      this.remindersForm.addControl('weekday', this.weekday);
    }

    if (freqSelected === FREQUENCY.Yearly) {
      this.remindersForm.addControl('month', this.month);
      this.remindersForm.addControl('day', this.day);
    }
  }

  enableSaveButton(): boolean {
    return this.remindersForm.valid && !this.remindersForm.pristine;
  }

  enableDeleteButton(): boolean {
    return this.remindersForm.valid && this.deleteState;
  }

  enableNewButton(): boolean {
    return this.remindersForm.valid && this.newState;
  }

  enableCancelButton(): boolean {
    return this.remindersForm.valid && this.cancelState;
  }

}
