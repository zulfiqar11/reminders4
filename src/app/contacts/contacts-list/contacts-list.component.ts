import { DataService } from './../../shared/services/data.service';
import { Component, OnInit } from '@angular/core';
import { ContactsList } from 'src/app/shared/model/contact';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-contacts-list',
  templateUrl: './contacts-list.component.html',
  styleUrls: ['./contacts-list.component.css']
})
export class ContactsListComponent implements OnInit {

  displayedColumns: string[] = ['id', 'listName', 'contactsCount', 'addedDate'];
  contactsFiles$!: Observable<ContactsList[]>;

  constructor(private dataService: DataService<ContactsList>) {
    this.dataService.Url('api/contactsList');
  }

  ngOnInit(): void {
    this.contactsFiles$ = this.dataService.get();
  }


}
