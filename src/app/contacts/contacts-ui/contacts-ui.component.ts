import { ContactuiService } from './../../shared/services/contactui.service';
import { DataService } from 'src/app/shared/services/data.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ContactDisplay } from 'src/app/shared/model/contact';
import { ContactNamesService } from 'src/app/shared/services/contactNames.service';
import { Reminder } from 'src/app/shared/model/reminder';

@Component({
  selector: 'app-contacts-ui',
  templateUrl: './contacts-ui.component.html',
  styleUrls: ['./contacts-ui.component.css']
})
export class ContactsUiComponent implements OnInit {

  remindersFormContactGroup!: FormGroup;
  contacts$!: Observable<ContactDisplay[]>;

  contactsListControl = new FormControl("", Validators.required);
  id = new FormControl("");
  firstNameControl = new FormControl({value: null, disabled: true}, Validators.required);
  lastNameControl = new FormControl({value: null, disabled: true}, Validators.required);
  emailAddressControl = new FormControl({value: null, disabled: true}, Validators.required);
  phoneNumberControl = new FormControl({value: null, disabled: true}, Validators.required);

  savedContactId = 0;

  constructor(fb: FormBuilder, private contactNamesService: ContactNamesService, private contactuiservice: ContactuiService) {
    this.CreateFormContactGroup(fb);
  }

  ngOnInit(): void {
    this.contactuiservice.contactValue.subscribe(contactId => {
      this.contactsListControl.setValue(contactId);
      this.savedContactId = contactId;
    })

    this.contactuiservice.emptyOutContact.subscribe(data => {
      this.emptyOutContactForm();
    })

    this.contactuiservice.emptyOutContactList.subscribe(data => {
      this.emptyOutContactListControl();
    })

    this.contactuiservice.populateContactGroup.subscribe(reminder => {
      this.populateContactFormGroup(reminder);
    })
    this.manageSelectContact();

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
  }

  CreateFormContactGroup(fb: FormBuilder) {
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
  }

  manageSelectContact() {
    let contactListControl = this.remindersFormContactGroup.get('contactsList');
    contactListControl?.valueChanges.subscribe((contactId: string) => {
      this.selectContact(+contactId);
    })
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
          this.contactuiservice.selectedContactSubject.next(this.remindersFormContactGroup);
        }
    });
  }

  emptyOutContactForm() {

    let formContactsGroupControls = this.remindersFormContactGroup.controls;
    formContactsGroupControls.id.setValue("");

    formContactsGroupControls.firstName.setValue("");
    formContactsGroupControls.lastName.setValue("");
    formContactsGroupControls.emailAddress.setValue("");
    formContactsGroupControls.phoneNumber.setValue("");

    formContactsGroupControls.contactsList?.setValue("");
  }

  emptyOutContactListControl() {
    if (!this.remindersFormContactGroup.get('contactsList')) {
      this.remindersFormContactGroup.addControl('contactsList', this.contactsListControl);
      this.remindersFormContactGroup.controls.contactsList?.setValue("");
    }
  }

  populateContactFormGroup(reminder: Reminder) {
    this.contactsListControl.setValue(this.savedContactId);

    this.remindersFormContactGroup.patchValue({
      id: reminder.id,
      firstName : reminder.firstName,
      lastName : reminder.lastName,
      emailAddress : reminder.emailAddress,
      phoneNumber : reminder.phoneNumber,
    })

    this.contactuiservice.selectedContactSubject.next(this.remindersFormContactGroup);
  }

}
