import { ButtonuiService } from './../../services/buttonui.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-buttons',
  templateUrl: './buttons.component.html',
  styleUrls: ['./buttons.component.css']
})
export class ButtonsComponent implements OnInit {

  form!: FormGroup;

  constructor(private buttonuiservice: ButtonuiService) { }

  ngOnInit(): void {
    this.buttonuiservice.markFormPristine.subscribe(data => {
      this.form.markAsPristine;
    })
    this.buttonuiservice.updateFormValues.subscribe(data => {
      this.form = data;
    })
    this.buttonuiservice.updateFormStatus.subscribe(data => {
      this.form = data;
    })

  }

  onSave() {
    this.buttonuiservice.onSaveSubject.next();
    this.buttonuiservice.markFormPristineSubject.next();
  }

  onCancel() {
    this.buttonuiservice.onCancelSubject.next();
  }

  onDelete() {
    this.buttonuiservice.onDeleteSubject.next();
  }

  onNew() {
    this.buttonuiservice.onNewSubject.next();
  }

  enableSaveState(): boolean {
    return this.form.valid && !this.form.pristine;
  }

  enableNewState(): boolean {
    return this.form.valid && this.form.pristine;
  }

  enableDeleteState(): boolean {
    return this.enableNewState();
  }

  enableCancelState(): boolean {
    return this.enableSaveState();
  }

}
