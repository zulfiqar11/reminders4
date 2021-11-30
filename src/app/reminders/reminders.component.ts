import { ContactNamesService } from './../shared/services/contactNames.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Reminder } from '../shared/model/reminder';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { map } from 'rxjs/operators';
import { ContactDisplay } from '../shared/model/contact';
import { DataService } from '../shared/services/data.service';

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
  styleUrls: ['./reminders.component.css'],
})

export class RemindersComponent implements OnInit {

  // TODO: BUG - CONTACTS LIST AND CONTACT CONTROLS SHOULD BE READ-ONLY.
  // TODO: BUG - ONCE RECORD WITH ID 1 IS SELECTED THEN WHEN HIT NEW THE SAME DATE IS COPIED ON THE NEW RECORD.
  // TODO: BUG - WHEN FORM (DIRTY = TRUE) CANCEL BUTTON SHOULD BE ENABLED
  // TODO: BUG - CANCEL BUTTON (WHEN NEW RECORD CLEAR OUT EVERY THING) AND (WHEN EXISTING RECORD ONLY CLEAR OUT THE DIRTY FIELDS.)

  // TODO: FILE UPLOAD TO SEND MESSAGE WITH AN IMAGE FILE.
  // TODO: MANAGE BUTTONS LIKE SAVE DELETE ETC BASED ON FORM VALID OR STATE CHANGES.
  // TODO: table have rows selected by check boxes and be able to select some check boxes and delete them
  // TODO: create campaigns and for some contacts upload file and send messages to all those contacts.
  // TODO: WHEN ALL RECORDS ARE DELETED , SAVE NEW RECORD DOES NOT WORK
  // TODO: REMOVE REMINDERS SERVICE.
  // TODO: first set the date and then based on that set the frequency.
  // TODO: consolidate date frequency component and use it in reminders campaign as well.

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

  remindersFormGroupValueChanges: any;
  remindersFormGroupStatusChanges: any;

  remindersFormGroup!: FormGroup;
  id = new FormControl("");
  firstNameControl = new FormControl("", Validators.required);
  lastNameControl = new FormControl("", Validators.required);
  emailAddressControl = new FormControl("", Validators.required);
  phoneNumberControl = new FormControl("", Validators.required);
  frequencyControl = new FormControl("", Validators.required);
  timeControl = new FormControl("", Validators.required);
  messageControl = new FormControl("", Validators.required);

  contactsListControl = new FormControl("");

  dateControl = new FormControl("");
  weekdayControl = new FormControl("");
  dayControl = new FormControl("");
  monthControl = new FormControl("");
  weekControl = new FormControl("");

  reminderSelected = false;
  newState = false;
  cancelState = false;
  deleteState = false;

  constructor(fb: FormBuilder,private dataService: DataService<Reminder>, private datePipe: DatePipe, private contactNamesService: ContactNamesService) {
    this.dataService.Url("api/reminders");
    this.remindersFormGroup = fb.group(
      {
        id: this.id,
        firstName: this.firstNameControl,
        lastName: this.lastNameControl,
        phoneNumber: this.phoneNumberControl,
        emailAddress: this.emailAddressControl,
        frequency: this.frequencyControl,
        contactsList: this.contactsListControl,
        time: this.timeControl,
        message: this.messageControl
      }
    )
  }

  ngOnInit(): void {
    this.remindersList$ = this.dataService.get();

    this.contacts$ = this.contactNamesService.get()
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

    let freqControl = this.remindersFormGroup.get('frequency');
    freqControl?.valueChanges.subscribe(freq => {
      this.selectFrequency(freq);
    })

    let contactListControl = this.remindersFormGroup.get('contactsList');
    contactListControl?.valueChanges.subscribe((contactId: string) => {
      this.selectContact(+contactId);
    })

    this.remindersFormGroup.valueChanges.subscribe(data => this.remindersFormGroupValueChanges = JSON.stringify(data));
    this.remindersFormGroup.statusChanges.subscribe(data => this.remindersFormGroupStatusChanges =  JSON.stringify(data));
  }

  selectReminder(reminder: Reminder) {
    this.remindersFormGroup.removeControl('contactsList');
    this.populateReminderControl(reminder);

    this.reminderSelected = true;
    this.cancelState = false;
    this.deleteState = true;
    this.newState = true;

  }

  populateReminderControl(reminder: Reminder) {

    this.removeControls();

    this.remindersFormGroup.patchValue({
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
      this.remindersFormGroup.addControl('date', this.dateControl);
      this.remindersFormGroup.patchValue({date: new Date(reminder.date!).toISOString()});
    }

    if (reminder.frequency === FREQUENCY.Weekly) {
      this.remindersFormGroup.addControl('weekday', this.weekdayControl);
      this.remindersFormGroup.patchValue({weekday: reminder.weekday});
    }

    if (reminder.frequency === FREQUENCY.Monthly) {
      this.remindersFormGroup.addControl('day', this.dayControl);
      this.remindersFormGroup.patchValue({day: reminder.day});
    }

    if (reminder.frequency === FREQUENCY.Yearly) {
      this.remindersFormGroup.addControl('month', this.monthControl);
      this.remindersFormGroup.patchValue({month: reminder.month});

      this.remindersFormGroup.addControl('day', this.dayControl);
      this.remindersFormGroup.patchValue({day: reminder.day});
    }

    if (reminder.frequency === FREQUENCY.MonthWeekly) {
      this.remindersFormGroup.addControl('week', this.weekControl);
      this.remindersFormGroup.patchValue({week: reminder.week});
      this.remindersFormGroup.addControl('weekday', this.weekdayControl);
      this.remindersFormGroup.patchValue({weekday: reminder.weekday});
    }
  }

  populateReminder(): Reminder {
    let reminder: Reminder =  {
      id: this.remindersFormGroup.controls.id.value,
      firstName: this.remindersFormGroup.controls.firstName.value,
      lastName: this.remindersFormGroup.controls.lastName.value,
      emailAddress: this.remindersFormGroup.controls.emailAddress.value,
      phoneNumber: this.remindersFormGroup.controls.phoneNumber.value,
      frequency: this.remindersFormGroup.controls.frequency.value,
      time: this.remindersFormGroup.controls.time.value,
      message: this.remindersFormGroup.controls.message.value
    }

    if (!this.reminderSelected) {
      reminder.id = 0;
    }

    if (reminder.frequency === FREQUENCY.Once) {
      return {...reminder, date: this.datePipe.transform(this.remindersFormGroup.controls.date.value, 'MM/dd/yyyy')}
    }
    if (reminder.frequency === FREQUENCY.Weekly) {
      return {...reminder, weekday: this.remindersFormGroup.controls.weekday.value}
    }
    if (reminder.frequency === FREQUENCY.Monthly) {
      return {...reminder, day: this.remindersFormGroup.controls.day.value}
    }
    if (reminder.frequency === FREQUENCY.MonthWeekly) {
      return {...reminder, week: this.remindersFormGroup.controls.week.value, weekday: this.remindersFormGroup.controls.weekday.value}
    }
    if (reminder.frequency === FREQUENCY.Yearly) {
      return {...reminder, day: this.remindersFormGroup.controls.day.value, month: this.remindersFormGroup.controls.month.value}
    }

    return reminder;
  }

  onSave() {

    let reminder = this.populateReminder();

    if (reminder.id === 0) {
      this.spin = true;
      this.dataService.get().subscribe(reminders => {
        reminder.id = reminders[reminders.length - 1].id + 1;
        this.dataService.create(reminder).subscribe(() => this.spin = false);
        this.remindersList$ = this.dataService.get();
      })
    }
    else {
      this.spin = true;
      this.dataService.update(reminder, reminder.id).subscribe(() => this.spin = false);
      this.remindersList$ = this.dataService.get();
    }

    this.cancelState = false;
  }

  onDelete() {
    this.spin = true;
    let reminder = this.populateReminder();
    this.dataService.delete(reminder, reminder.id).subscribe(() => this.spin = false);
    this.remindersList$ = this.dataService.get();
  }

  onNew() {
    this.remindersFormGroup.addControl('contactsList', this.contactsListControl);
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

    this.remindersFormGroup.controls.id.setValue("");

    this.remindersFormGroup.controls.firstName.setValue("");
    this.remindersFormGroup.controls.lastName.setValue("");
    this.remindersFormGroup.controls.emailAddress.setValue("");
    this.remindersFormGroup.controls.phoneNumber.setValue("");

    this.remindersFormGroup.controls.contactsList.setValue("");

    this.remindersFormGroup.controls.frequency.setValue("");
    this.remindersFormGroup.controls.time.setValue("");
    this.remindersFormGroup.controls.message.setValue("");

    if (this.remindersFormGroup.controls.frequency.value === FREQUENCY.Once) {
      this.remindersFormGroup.controls.date.setValue("");
    }
    if (this.remindersFormGroup.controls.frequency.value === FREQUENCY.Weekly) {
      this.remindersFormGroup.controls.weekday.setValue("");
    }
    if (this.remindersFormGroup.controls.frequency.value === FREQUENCY.Monthly) {
      this.remindersFormGroup.controls.day.setValue("");
    }
    if (this.remindersFormGroup.controls.frequency.value === FREQUENCY.MonthWeekly) {
      this.remindersFormGroup.controls.week.setValue("");
      this.remindersFormGroup.controls.weekday.setValue("");
    }
    if (this.remindersFormGroup.controls.frequency.value === FREQUENCY.Yearly) {
      this.remindersFormGroup.controls.month.setValue("");
      this.remindersFormGroup.controls.day.setValue("");
    }

  }

  removeControls() {

    this.remindersFormGroup.removeControl('date');
    this.remindersFormGroup.removeControl('weekday');
    this.remindersFormGroup.removeControl('day');
    this.remindersFormGroup.removeControl('month');
    this.remindersFormGroup.removeControl('week');
  }

  selectContact(contactId: number) {
    let contacts$ = this.contactNamesService.get().pipe(
      map(contacts => contacts.filter(contact => contact.id === contactId))
      ).subscribe(contacts => {
        this.remindersFormGroup.patchValue({
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
      this.remindersFormGroup.addControl('date', this.dateControl);
    }

    if (freqSelected=== FREQUENCY.Weekly) {
      this.remindersFormGroup.addControl('weekday', this.weekdayControl);
    }

    if (freqSelected=== FREQUENCY.Monthly) {
      this.remindersFormGroup.addControl('day', this.dayControl);
    }

    if (freqSelected === FREQUENCY.MonthWeekly) {
      this.remindersFormGroup.addControl('week', this.weekControl);
      this.remindersFormGroup.addControl('weekday', this.weekdayControl);
    }

    if (freqSelected === FREQUENCY.Yearly) {
      this.remindersFormGroup.addControl('month', this.monthControl);
      this.remindersFormGroup.addControl('day', this.dayControl);
    }
  }

  enableSaveButton(): boolean {
    return this.remindersFormGroup.valid && !this.remindersFormGroup.pristine;
  }

  enableDeleteButton(): boolean {
    return this.remindersFormGroup.valid && this.deleteState;
  }

  enableNewButton(): boolean {
    return this.remindersFormGroup.valid && this.newState;
  }

  enableCancelButton(): boolean {
    return this.remindersFormGroup.valid && this.cancelState;
  }

}
