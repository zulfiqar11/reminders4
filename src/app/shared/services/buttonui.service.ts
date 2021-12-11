import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ButtonuiService {

  onSaveSubject = new Subject();
  onSave = this.onSaveSubject.asObservable();

  onNewSubject = new Subject();
  onNew = this.onNewSubject.asObservable();

  onDeleteSubject = new Subject();
  onDelete = this.onDeleteSubject.asObservable();

  onCancelSubject = new Subject();
  onCancel = this.onCancelSubject.asObservable();

  markFormPristineSubject = new Subject();
  markFormPristine = this.markFormPristineSubject.asObservable();

  updateFormValuesSubject = new Subject<FormGroup>();
  updateFormValues = this.updateFormValuesSubject.asObservable();

  updateFormStatusSubject = new Subject<FormGroup>();
  updateFormStatus = this.updateFormStatusSubject.asObservable();



  constructor() { }
}
