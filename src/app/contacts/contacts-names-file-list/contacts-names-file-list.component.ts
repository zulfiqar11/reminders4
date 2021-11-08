import { ContactNamesService } from './../../shared/services/contactNames.service';
import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ContactsNameDisplay } from 'src/app/shared/model/contact';

@Component({
  selector: 'app-contacts-names-file-list',
  templateUrl: './contacts-names-file-list.component.html',
  styleUrls: ['./contacts-names-file-list.component.css']
})
export class ContactsNamesFileListComponent implements OnInit {

  displayedColumnsContactNames: string[] = ['firstName', 'lastName', 'phone', 'email'];
  contactNames$!: Observable<ContactsNameDisplay[]>;

  constructor(private contactNameservice: ContactNamesService) {
  }

  ngOnInit(): void {
    this.contactNameservice.activatedEmitter.subscribe(data => {
      this.contactNames$ = of(data);
    })
  }

}
