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

  // TODO: REFACTOR THE WHOLE CONTACTS SCREEN SIMILAR TO THE REMINDERS SCREEN.
  // TODO: REFACOR THE CONTROL NAME AND FORM NAME IN TERMS OF VARIABLES NAMES.

  // TODO: FIX THE CONTACTS SCREEN BUTTONS AND REFACTOR THEM JUST LIKE REMINDERS SCREEN.
  // TODO: table have rows selected by check boxes and be able to select some check boxes and delete them
  // TODO: upload file of contacts and add contacts from the file.
  // TODO: WHEN ALL RECORDS ARE DELETED , SAVE NEW RECORD DOES NOT WORK


  // TODO: FILE UPLOAD FOR CONTACTS IMAGE. DEFAULT IMAGE AS WELL.
  // TODO: CONTACT IMAGE DISPLAY NEXT TO THE CONTACT IN CONTACT LIST.

  btnState: any = {
    Update: true,
    Delete: true,
    Add: true,
    New: true
  }

  contactsList$!: Observable<Contact[]>;
  contact!: Contact;
  spin = false;

  displayedColumns: string[] = ['id', 'photo', 'firstName', 'lastName', 'phoneNumber', 'emailAddress'];

  form!: FormGroup;
  id = new FormControl("");
  firstName = new FormControl("", Validators.required);
  lastName = new FormControl("", Validators.required);
  emailAddress = new FormControl("", Validators.required);
  phoneNumber = new FormControl("", Validators.required);
  photo = new FormControl("");
  fileUploadControl = new FormControl("");

  constructor(fb: FormBuilder, private dataService: DataService<Contact>, private fireStorage: AngularFireStorage) {
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
              this.populateFormControl(this.contact);
              this.spin = false;
            })
          })
        )
        .subscribe()
    });



    this.btnState.New = false;
    this.btnState.Add = true;
    this.btnState.Update = false;
    this.btnState.Delete = false;
  }

  selectContact(contact: Contact) {
    this.populateFormControl(contact);

    this.btnState.New = true;
    this.btnState.Add = false;
    this.btnState.Update = true;
    this.btnState.Delete = true;
  }

  onUpdate() {
    this.spin = true;
    let contact = this.populateContact();
    this.dataService.update(contact, contact.id).subscribe(() => this.spin = false);
    this.contactsList$ = this.dataService.get();
  }

  onAdd() {
    this.spin = true;
    this.dataService.get().subscribe(contacts => {
      let contact = this.populateContact();
      let maxId = contacts[contacts.length - 1].id + 1;
      contact.id = maxId;
      this.dataService.create(contact).subscribe(() => this.spin = false);
      this.contactsList$ = this.dataService.get();
    })
  }

  onDelete() {
    this.spin = true;
    let contact = this.populateContact();
    this.dataService.delete(contact, contact.id).subscribe(() => {
      this.spin = false;
    });
    this.contactsList$ = this.dataService.get();

    this.emptyOutForm();
    this.btnState.New = false;
    this.btnState.Add = true;
    this.btnState.Update = false;
    this.btnState.Delete = false;
  }

  onNew() {
    this.emptyOutForm();

    this.btnState.New = false;
    this.btnState.Add = true;
    this.btnState.Update = false;
    this.btnState.Delete = false;
  }

  emptyOutForm() {
    this.form.controls.id.setValue("");
    this.form.controls.firstName.setValue("");
    this.form.controls.lastName.setValue("");
    this.form.controls.emailAddress.setValue("");
    this.form.controls.phoneNumber.setValue("");
    this.form.controls.photo.setValue("");
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

  enableUpdateState(): boolean {
    return this.form.valid && this.btnState.Update;
  }

  enableNewState(): boolean {
    return this.form.valid && this.btnState.New;
  }

  enableDeleteState(): boolean {
    return this.form.valid && this.btnState.Delete;
  }

  enableAddState(): boolean {
    return this.form.valid && this.btnState.Add;
  }

}
