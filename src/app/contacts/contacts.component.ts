import { ContactService } from './../shared/services/contact.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { Observable } from 'rxjs';
import { Contact } from '../shared/model/contact';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css']
})
export class ContactsComponent implements OnInit {

  // TODO: REFACTOR THE WHOLE CONTACTS SCREEN SIMILAR TO THE REMINDERS SCREEN.
  // TODO: REFACOR THE CONTROL NAME AND FORM NAME IN TERMS OF VARIABLES NAMES.
  // TODO: FILE UPLOAD FOR CONTACTS IMAGE. DEFAULT IMAGE AS WELL.
  // TODO: FIX THE CONTACTS SCREEN BUTTONS AND REFACTOR THEM.
  btnState: any = {
    Update: true,
    Delete: true,
    Add: true,
    New: true
  }

  contactsList$!: Observable<Contact[]>;
  spin = false;

  displayedColumns: string[] = ['id', 'firstName', 'lastName', 'phoneNumber', 'emailAddress'];

  form!: FormGroup;
  id = new FormControl("");
  firstName = new FormControl("", Validators.required);
  lastName = new FormControl("", Validators.required);
  emailAddress = new FormControl("", Validators.required);
  phoneNumber = new FormControl("", Validators.required);

  constructor(fb: FormBuilder, private contactService: ContactService) {
    this.form = fb.group(
      {
        "id": this.id,
        "firstName": this.firstName,
        "lastName": this.lastName,
        "phoneNumber": this.phoneNumber,
        "emailAddress": this.emailAddress
      }
    )
   }

  ngOnInit(): void {
    this.contactsList$ = this.contactService.getContacts();

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
    this.contactService.update(contact).subscribe(() => this.spin = false);
    this.contactsList$ = this.contactService.getContacts();
  }

  onAdd() {
    // TODO: WHEN ALL RECORDS ARE DELETED , SAVE NEW RECORD DOES NOT WORK
    this.spin = true;
    this.contactService.getContacts().subscribe(contacts => {
      let contact = this.populateContact();
      let maxId = contacts[contacts.length - 1].id + 1;
      contact.id = maxId;
      this.contactService.create(contact).subscribe(() => this.spin = false);
      this.contactsList$ = this.contactService.getContacts();
    })
  }

  onDelete() {
    this.spin = true;
    let contact = this.populateContact();
    this.contactService.delete(contact).subscribe(() => {
      this.spin = false;
    });
    this.contactsList$ = this.contactService.getContacts();

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
  }

  populateContact(): Contact {
    return {
      id: this.form.controls.id.value,
      firstName: this.form.controls.firstName.value,
      lastName: this.form.controls.lastName.value,
      emailAddress: this.form.controls.emailAddress.value,
      phoneNumber: this.form.controls.phoneNumber.value,
    }
  }


  populateFormControl(contact: Contact) {
    this.form.patchValue({
      id: contact.id,
      firstName : contact.firstName,
      lastName : contact.lastName,
      emailAddress : contact.emailAddress,
      phoneNumber : contact.phoneNumber
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
