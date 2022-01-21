import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-hisform',
  templateUrl: './hisform.component.html',
  styleUrls: ['./hisform.component.css']
})
export class HisformComponent implements OnInit {

  formGroup!: FormGroup;
  contacts!: FormArray;
  contacts1!: FormArray;

  constructor(private fb : FormBuilder) { }

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      firstName: [''],
      lastName: [''],
      contacts1: this.fb.array([]),
      contacts: this.fb.array([])
    })
  }

  createContact(): FormGroup {
    return this.fb.group({
      email: '',
      primary: false,
      phone: ''
    });
  }

  onSubmit(): void {
    console.log(this.formGroup.value);
  }

  get contactsItems() : FormArray {
    return <FormArray>this.formGroup.controls["contacts"];
  }

  get contactsItems1() : FormArray {
    return <FormArray>this.formGroup.controls["contacts1"];
  }

  addContact() {
    this.contactsItems.push(this.createContact());
  }
  addContact1() {
    this.contactsItems1.push(new FormControl(''));
  }

  deleteContact(i: number) {
    this.contactsItems.removeAt(i);
  }
  deleteContact1(i: number) {
    this.contactsItems1.removeAt(i);
  }

}
