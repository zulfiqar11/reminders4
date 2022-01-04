import { ContactsService } from './../shared/services/contacts.service';
import { ButtonuiService } from './../shared/services/buttonui.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { Observable, of } from 'rxjs';
import { Contact } from '../shared/model/contact';
import { DataService } from '../shared/services/data.service';

import { AngularFireStorage } from '@angular/fire/storage'
import { finalize } from 'rxjs/operators';
import { SubscriptionsContainer } from '../shared/SubscriptionsContainer';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css']
})
export class ContactsComponent implements OnInit, OnDestroy {

  // TODO: BUG - START FRESH - SELECT CONTACT - LOAD PICTURE - SAVE BUTTONN IS NOT ENABLED.
  // TODO: REFACTOR THE WHOLE CONTACTS SCREEN SIMILAR TO THE REMINDERS SCREEN.
  // TODO: REFACOR THE CONTROL NAME AND FORM NAME IN TERMS OF VARIABLES NAMES.
  // TODO: REFACTOR - WHY DO WE STILL NEED THE DATASERVICE IN THIS COMPONENT AND INTITIALIZE IN CONSTRUCTOR?

  // TODO: table have rows selected by check boxes and be able to select some check boxes and delete them
  // TODO: upload file of contacts and add contacts from the file.
  // TODO: WHEN ALL RECORDS ARE DELETED , SAVE NEW RECORD DOES NOT WORK


  // TODO: FILE UPLOAD FOR CONTACTS IMAGE. DEFAULT IMAGE AS WELL.

  contactsList$!: Observable<Contact[]>;
  contact!: Contact;
  savedContact!: Contact;
  spin = false;

  displayedColumns: string[] = ['id', 'photo', 'firstName', 'lastName', 'phoneNumber', 'emailAddress'];

  form!: FormGroup;
  id = new FormControl("");
  firstName = new FormControl("", Validators.required);
  lastName = new FormControl("", Validators.required);
  emailAddress = new FormControl("", Validators.required);
  phoneNumber = new FormControl("", Validators.required);
  photo = new FormControl("", Validators.required);
  fileUploadControl = new FormControl("");

  subs = new SubscriptionsContainer();

  constructor(fb: FormBuilder, private contactsService: ContactsService, private dataService: DataService<Contact[]>, private fireStorage: AngularFireStorage, private buttonsuiservice: ButtonuiService) {
    this.dataService.Url('api/contacts');
    this.form = fb.group(
      {
        "id": this.id,
        "firstName": this.firstName,
        "lastName": this.lastName,
        "phoneNumber": this.phoneNumber,
        "emailAddress": this.emailAddress,
        "photo": this.photo
      }
    )
  }

  ngOnDestroy(): void {
    this.subs.dispose();
  }

  ngOnInit(): void {
    this.contactsList$ = this.contactsService.getContactList();

    this.subs.add = this.buttonsuiservice.markFormPristine.subscribe(data => {
      this.form.markAsPristine();
    })

    this.subs.add = this.buttonsuiservice.onSave.subscribe(data => {
      this.onSave();
    });

    this.subs.add = this.buttonsuiservice.onDelete.subscribe(data => {
      this.onDelete();
    });

    this.subs.add = this.buttonsuiservice.onCancel.subscribe(data => {
      this.onCancel();
    });

    this.subs.add = this.buttonsuiservice.onNew.subscribe(data => {
      this.onNew();
    });

    this.subs.add = this.form.statusChanges.subscribe(data => {
      this.buttonsuiservice.updateFormStatusSubject.next(this.form);
    })

    this.subs.add = this.form.valueChanges.subscribe(data => {
      this.buttonsuiservice.updateFormValuesSubject.next(this.form);
    })

    this.subs.add = this.fileUploadControl.valueChanges.subscribe(file => {
      this.spin = true;
      let filePath = "/files" + Math.random() + file
      let fileRef = this.fireStorage.ref(filePath);
      // TODO: read documentation on angular fire storage, fileRef, file Path etc.
      this.fireStorage.upload(filePath, file )
        .snapshotChanges()
        .pipe(
          finalize(() => {
            // TODO: learn how this works.
            fileRef.getDownloadURL().subscribe((url) => {
              console.log('url', url);
              this.contact.photo = url;
              this.form.patchValue({
                photo: url
              })
              this.spin = false;
            })
          })
        )
        .subscribe()
    });
  }

  selectContact(contact: Contact) {
    this.savedContact = contact;
    this.populateFormControl(contact);
    this.contact = this.savedContact; // TODO: WHY ARE WE DOING THIS AGAIN?
    this.buttonsuiservice.markFormPristineSubject.next();
  }

  onSave() {
    this.spin = true;
    let contact = this.populateContact();
    if (!(contact.id >= 1)) {
      contact.id = 0;
    }
    this.contactsService.Save(contact);
    this.subs.add = this.contactsService.onSave.subscribe(() => {
      this.spin = false;
      this.contactsList$ = this.contactsService.getContactList();
    });
    this.buttonsuiservice.markFormPristineSubject.next();
  }

  onCancel() {
    if (this.contact.id === 0) {
      this.emptyOutForm();
    } else {
      this.contact = this.savedContact;
      this.populateFormControl(this.contact);
    }
    this.buttonsuiservice.markFormPristineSubject.next();
  }

  onDelete() {
    this.spin = true;
    let contact = this.populateContact();
    this.subs.add = this.contactsService.Delete(contact).subscribe(() => {
      this.spin = false;
    });
    this.contactsList$ = this.contactsService.getContactList();

    this.emptyOutForm();

  }

  onNew() {
    this.contact.id = 0;
    this.emptyOutForm();
  }

  emptyOutForm() {
    this.form.controls.id.setValue("");
    this.form.controls.firstName.setValue("");
    this.form.controls.lastName.setValue("");
    this.form.controls.emailAddress.setValue("");
    this.form.controls.phoneNumber.setValue("");
    this.form.controls.photo.setValue("");
    this.form.controls.fileUploadControl?.setValue("");
  }

  populateContact(): Contact {
    return {
      id: this.form.controls.id.value,
      firstName: this.form.controls.firstName.value,
      lastName: this.form.controls.lastName.value,
      emailAddress: this.form.controls.emailAddress.value,
      phoneNumber: this.form.controls.phoneNumber.value,
      photo: this.form.controls.photo.value
    }
  }


  populateFormControl(contact: Contact) {
    this.form.patchValue({
      id: contact.id,
      firstName : contact.firstName,
      lastName : contact.lastName,
      emailAddress : contact.emailAddress,
      phoneNumber : contact.phoneNumber,
      photo: contact.photo
    })
  }
}
