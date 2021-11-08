import { ContactNamesService } from './../../shared/services/contactNames.service';
import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ContactsList, ContactsListDisplay } from 'src/app/shared/model/contact';
import { DataService } from 'src/app/shared/services/data.service';

@Component({
  selector: 'app-contacts-file-list',
  templateUrl: './contacts-file-list.component.html',
  styleUrls: ['./contacts-file-list.component.css']
})
export class ContactsFileListComponent implements OnInit {

  displayedColumnsContactsList: string[] = ['id','listName', 'contactsCount', 'addedDate'];

  selectedContactFile! : ContactsListDisplay;

  spin = false;

  fileUploadControl = new FormControl("");

  contactsFiles$!: Observable<ContactsListDisplay[]>;

  fileLoaded = new EventEmitter<string[]>();
  fileDelete = new EventEmitter<ContactsList>();

  fileName: string = '';
  fileId = 0;

  constructor(private dataService: DataService<ContactsList>, private contactNameservice: ContactNamesService) {
    this.dataService.Url('api/contactsList');
  }

  ngOnInit(): void {

    this.contactsFiles$! = this.getContactsDistinctListData();

    this.fileUploadControl.valueChanges.subscribe(file => {
      let reader: FileReader = new FileReader();
      reader.readAsText(file!);
      this.fileName = file!.name;

      reader.onload = (e) => {
        this.spin = true;
        let csv: string = reader.result as string;
        let lines: string[] = [];
        lines = csv.split('\n');
        this.fileLoaded.emit(lines);
      }
    })

    this.dataService.get().subscribe(data => {
      this.fileId = data.length + 1;
    });

    this.fileLoaded.subscribe((lines: string[]) => {

      lines = lines.slice(1);

      lines.forEach(line => {

        let contact = line.split('\t');
        let currentDateTime = new Date().toLocaleTimeString([], {year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit'});
        currentDateTime = currentDateTime.replace(',', '');

        let contactList: ContactsList = {
            id: this.fileId,
            listName : this.fileName,
            contactsCount: (lines.length - 1),
            addedDate: currentDateTime,
            firstName: contact[0],
            lastName: contact[1],
            phone: contact[2],
            email: contact[3]
        };
        this.dataService.create(contactList).subscribe(data => data);
        this.fileId = this.fileId + 1;
      })
      this.contactsFiles$! = this.getContactsDistinctListData();
      this.spin = false;
    })

  }

  getContactsDistinctListData(): Observable<ContactsListDisplay[]> {
    return this.dataService.get().pipe(
      map(contactsfiles => {
          contactsfiles = contactsfiles.filter((thing, index, self) =>
          index === self.findIndex((t) => (
            t.listName === thing.listName
                && t.contactsCount === thing.contactsCount
                && t.addedDate === thing.addedDate))
          )
          return contactsfiles.map(contactFile => {
            return ({
              id: contactFile.id,
              listName: contactFile.listName,
              contactsCount: contactFile.contactsCount,
              addedDate: contactFile.addedDate
            })
          })
         })
    )
  }
  selectContactFile(selectedFile: ContactsListDisplay) {

    this.spin = true;
    this.selectedContactFile = selectedFile;

    // TODO: refactor to better map operator
    this.dataService.get().pipe(
      map(contactFiles => {
        return contactFiles.filter(file => file.listName === selectedFile.listName)
      })
    ).pipe(
      map(contacts => {
        return contacts.map(contact => {
            return ({
              firstName: contact.firstName,
              lastName: contact.lastName,
              phone: contact.phone,
              email: contact.email
            })
          }
        )
      })
      // TODO: refactor to better map operator
    ).subscribe(data => {
      this.contactNameservice.activatedEmitter.next(data);
      this.spin = false;
    });
  }

  onDelete() {
    this.dataService.get().subscribe(files => {
      files.map(file => {
          if (file.listName === this.selectedContactFile.listName) {
            this.spin = true;
            this.dataService.delete(file, file.id).subscribe(data => this.spin = false);
          }
      })
      this.contactsFiles$! = this.getContactsDistinctListData();
      this.selectContactFile({id: 0, listName: '', contactsCount: 0, addedDate: ''})
    });
  }
}
