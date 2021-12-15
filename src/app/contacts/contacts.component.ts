import { ButtonuiService } from './../shared/services/buttonui.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { Observable, of } from 'rxjs';
import { Contact } from '../shared/model/contact';
import { DataService } from '../shared/services/data.service';

import { AngularFireStorage } from '@angular/fire/storage'
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css']
})
export class ContactsComponent implements OnInit {

  // TODO: BUG - FORM SHOULD NOT BE VALID UNTIL PICTURE IS UPLOADED AND THEN SAVE SHOULD BE ENABLED.
  // TODO: BUG - START FRESH - SELECT CONTACT - LOAD PICTURE - SAVE BUTTONN IS NOT ENABLED.
  // TODO: REFACTOR THE WHOLE CONTACTS SCREEN SIMILAR TO THE REMINDERS SCREEN.
  // TODO: REFACOR THE CONTROL NAME AND FORM NAME IN TERMS OF VARIABLES NAMES.

  // TODO: FIX THE CONTACTS SCREEN BUTTONS AND REFACTOR THEM JUST LIKE REMINDERS SCREEN.
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

  constructor(fb: FormBuilder, private dataService: DataService<Contact>, private fireStorage: AngularFireStorage, private buttonsuiservice: ButtonuiService) {
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

  ngOnInit(): void {
    this.contactsList$ = this.dataService.get();

    this.buttonsuiservice.markFormPristine.subscribe(data => {
      this.form.markAsPristine();
    })

    this.buttonsuiservice.onSave.subscribe(data => {
      this.onSave();
    });

    this.buttonsuiservice.onDelete.subscribe(data => {
      this.onDelete();
    });

    this.buttonsuiservice.onCancel.subscribe(data => {
      this.onCancel();
    });

    this.buttonsuiservice.onNew.subscribe(data => {
      this.onNew();
    });

    this.form.statusChanges.subscribe(data => {
      this.buttonsuiservice.updateFormStatusSubject.next(this.form);
    })

    this.form.valueChanges.subscribe(data => {
      this.buttonsuiservice.updateFormValuesSubject.next(this.form);
    })

    this.fileUploadControl.valueChanges.subscribe(file => {
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
    this.buttonsuiservice.markFormPristineSubject.next();
  }

  onSave() {
    this.spin = true;
    if (this.contact?.id === 0) {
      this.dataService.get().subscribe(contacts => {
        let contact = this.populateContact();
        let maxId = contacts[contacts.length - 1].id + 1;
        contact.id = maxId;
        this.dataService.create(contact).subscribe(() => this.spin = false);
        this.contactsList$ = this.dataService.get();
      })
    } else {
      let contact = this.populateContact();
      this.dataService.update(contact, contact.id).subscribe(() => this.spin = false);
      this.contactsList$ = this.dataService.get();
    }
    this.buttonsuiservice.markFormPristineSubject.next();
  }

  onCancel() {
    if (this.contact.id === 0) {
      this.emptyOutForm();
    } else {
      this.populateFormControl(this.savedContact);
    }
    this.buttonsuiservice.markFormPristineSubject.next();
  }

  onDelete() {
    this.spin = true;
    let contact = this.populateContact();
    this.dataService.delete(contact, contact.id).subscribe(() => {
      this.spin = false;
    });
    this.contactsList$ = this.dataService.get();

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
    this.contact = contact;
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
