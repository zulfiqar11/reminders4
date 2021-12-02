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

  // TODO: BUG - AFTER SAVE EXISTING RECORD DIRTY FLAG AND TOUCHED FLAD SHOULD BE FALSE WHEN CLICKING ON EXISTING RECORDS.
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

  remindersFormContactGroupValueChanges: any;
  remindersFormContactGroupStatusChanges: any;
  remindersFormGroupValueChanges: any;
  remindersFormGroupStatusChanges: any;

  remindersFormGroup!: FormGroup;
  remindersFormContactGroup!: FormGroup;


  id = new FormControl("");
  firstNameControl = new FormControl({value: null, disabled: true}, Validators.required);
  lastNameControl = new FormControl({value: null, disabled: true}, Validators.required);
  emailAddressControl = new FormControl({value: null, disabled: true}, Validators.required);
  phoneNumberControl = new FormControl({value: null, disabled: true}, Validators.required);
  frequencyControl = new FormControl("", Validators.required);
  timeControl = new FormControl("", Validators.required);
  messageControl = new FormControl("", Validators.required);

  contactsListControl = new FormControl("", Validators.required);

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
    this.remindersFormContactGroup = fb.group(
      {
        id: this.id,
        contactsList: this.contactsListControl,
        firstName: this.firstNameControl,
        lastName: this.lastNameControl,
        phoneNumber: this.phoneNumberControl,
        emailAddress: this.emailAddressControl,
      }
    )
    this.remindersFormGroup = fb.group(
      {
        frequency: this.frequencyControl,
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

    let contactListControl = this.remindersFormContactGroup.get('contactsList');
    contactListControl?.valueChanges.subscribe((contactId: string) => {
      this.selectContact(+contactId);
    })

    this.remindersFormGroup.valueChanges.subscribe(data => this.remindersFormGroupValueChanges = JSON.stringify(data));
    this.remindersFormContactGroup.valueChanges.subscribe(data => this.remindersFormContactGroupValueChanges = JSON.stringify(data));
    this.remindersFormGroup.statusChanges.subscribe(data => this.remindersFormGroupStatusChanges =  JSON.stringify(data));
    this.remindersFormContactGroup.statusChanges.subscribe(data => this.remindersFormContactGroupStatusChanges =  JSON.stringify(data));
  }

  selectReminder(reminder: Reminder) {
    this.remindersFormContactGroup.removeControl('contactsList');
    this.populateReminderControl(reminder);

    this.reminderSelected = true;
    this.cancelState = false;
    this.deleteState = true;
    this.newState = true;

  }

  populateReminderControl(reminder: Reminder) {

    this.removeControls();

    this.remindersFormContactGroup.patchValue({
      id: reminder.id,
      firstName : reminder.firstName,
      lastName : reminder.lastName,
      emailAddress : reminder.emailAddress,
      phoneNumber : reminder.phoneNumber,
    })

    this.remindersFormGroup.patchValue({
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
    let formReminderFreqControls = this.remindersFormGroup.controls;
    let formContactsGroupControls = this.remindersFormContactGroup.controls;

    let reminder: Reminder =  {

      id: formContactsGroupControls.id.value,
      firstName: formContactsGroupControls.firstName.value,
      lastName: formContactsGroupControls.lastName.value,
      emailAddress: formContactsGroupControls.emailAddress.value,
      phoneNumber: formContactsGroupControls.phoneNumber.value,

      frequency: formReminderFreqControls.frequency.value,
      time: formReminderFreqControls.time.value,
      message: formReminderFreqControls.message.value
    }

    if (!this.reminderSelected) {
      reminder.id = 0;
    }

    if (reminder.frequency === FREQUENCY.Once) {
      return {...reminder, date: this.datePipe.transform(formReminderFreqControls.date.value, 'MM/dd/yyyy')}
    }
    if (reminder.frequency === FREQUENCY.Weekly) {
      return {...reminder, weekday: formReminderFreqControls.weekday.value}
    }
    if (reminder.frequency === FREQUENCY.Monthly) {
      return {...reminder, day: formReminderFreqControls.day.value}
    }
    if (reminder.frequency === FREQUENCY.MonthWeekly) {
      return {...reminder, week: formReminderFreqControls.week.value, weekday: formReminderFreqControls.weekday.value}
    }
    if (reminder.frequency === FREQUENCY.Yearly) {
      return {...reminder, day: formReminderFreqControls.day.value, month: formReminderFreqControls.month.value}
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
    this.emptyOutForm();
    if (!this.remindersFormContactGroup.get('contactsList')) {
      this.remindersFormContactGroup.addControl('contactsList', this.contactsListControl);
      this.remindersFormContactGroup.controls.contactsList?.setValue("");
    }
    this.reminderSelected = false;
  }

  onNew() {
    this.remindersFormContactGroup.addControl('contactsList', this.contactsListControl);
    this.emptyOutForm();
    this.removeControls();
    this.reminderSelected = false;
    this.cancelState = true;
    this.deleteState = false;
    this.newState = false;
  }

  onCancel() {
    this.emptyOutForm();
    this.removeControls();
    this.cancelState = false;
  }

  emptyOutForm() {

    let formContactsGroupControls = this.remindersFormContactGroup.controls;
    formContactsGroupControls.id.setValue("");

    formContactsGroupControls.firstName.setValue("");
    formContactsGroupControls.lastName.setValue("");
    formContactsGroupControls.emailAddress.setValue("");
    formContactsGroupControls.phoneNumber.setValue("");

    formContactsGroupControls.contactsList?.setValue("");

    let formReminderFreqControls = this.remindersFormGroup.controls;
    formReminderFreqControls.frequency.setValue("");
    formReminderFreqControls.time.setValue("");
    formReminderFreqControls.message.setValue("");

    if (formReminderFreqControls.frequency.value === FREQUENCY.Once) {
      formReminderFreqControls.date.setValue("");
    }
    if (formReminderFreqControls.frequency.value === FREQUENCY.Weekly) {
      formReminderFreqControls.weekday.setValue("");
    }
    if (formReminderFreqControls.frequency.value === FREQUENCY.Monthly) {
      formReminderFreqControls.day.setValue("");
    }
    if (formReminderFreqControls.frequency.value === FREQUENCY.MonthWeekly) {
      formReminderFreqControls.week.setValue("");
      formReminderFreqControls.weekday.setValue("");
    }
    if (formReminderFreqControls.frequency.value === FREQUENCY.Yearly) {
      formReminderFreqControls.month.setValue("");
      formReminderFreqControls.day.setValue("");
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
    this.contactNamesService.get().pipe(
      map(contacts => contacts.filter(contact => contact.id === contactId))
      ).subscribe(contacts => {
        if (contacts.length === 1) {
          let contact = contacts[0];
          this.remindersFormContactGroup.patchValue({
            firstName : contact.firstName,
            lastName : contact.lastName,
            emailAddress : contact.emailAddress,
            phoneNumber : contact.phoneNumber
          });
        }
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
    return this.remindersFormGroup.valid && this.remindersFormContactGroup.valid && !this.remindersFormGroup.pristine;
  }

  enableDeleteButton(): boolean {
    return this.remindersFormGroup.valid && this.remindersFormContactGroup.valid && this.deleteState;
  }

  enableNewButton(): boolean {
    return this.remindersFormGroup.valid && this.remindersFormContactGroup.valid && this.newState;
  }

  enableCancelButton(): boolean {
    return !this.remindersFormGroup.pristine && !this.remindersFormContactGroup.pristine && this.cancelState;
  }

}
