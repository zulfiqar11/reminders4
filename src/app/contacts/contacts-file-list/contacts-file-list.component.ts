import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, OnInit } from '@angular/core';
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

  displayedColumnsContactsList: string[] = ['listName', 'contactsCount', 'addedDate'];
  displayedColumnsContactNames: string[] = ['firstName', 'lastName', 'phone', 'email'];

  selectedContactFile! : ContactsListDisplay;

  spin = false;

  //TODO: refactor following to strong datatype
  contactsFiles$!: Observable<ContactsListDisplay[]>;
  contactNames$!: Observable<any[]>;

  fileLoaded = new EventEmitter<string[]>();
  fileDelete = new EventEmitter<ContactsList>();

  fileName: string = '';
  fileId = 0;

  constructor(private dataService: DataService<ContactsList>, private http: HttpClient) {
    this.dataService.Url('api/contactsList');
  }

  ngOnInit(): void {

    this.contactsFiles$! = this.getContactsDistinctListData();

    this.dataService.get().subscribe(data => {
      this.fileId = data.length + 1;
    });

    this.fileLoaded.subscribe((lines: string[]) => {

      // TODO: when another .csv file is uploaded it replaces the existing .csv file.
      let theId = this.fileId

      lines = lines.slice(1);

      lines.forEach(line => {

        let contact = line.split('\t');
        let currentDateTime = new Date().toLocaleTimeString([], {year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit'});
        currentDateTime = currentDateTime.replace(',', '');

        let contactList: ContactsList = {
            id: theId,
            listName : this.fileName,
            contactsCount: (lines.length - 1),
            addedDate: currentDateTime,
            firstName: contact[0],
            lastName: contact[1],
            phone: contact[2],
            email: contact[3]
        };
        this.dataService.create(contactList).subscribe(data => data);
        theId = theId + 1;
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
      this.contactNames$ = of(data);
      this.spin = false;
    });
  }

  public changeListener() {
    let lines: string[] = [];
    let file = (<HTMLInputElement>document.getElementById('fileUpload')).files![0];
    let reader: FileReader = new FileReader();
    reader.readAsText(file!);
    this.fileName = file!.name;

    reader.onload = (e) => {
      this.spin = true;
      let csv: string = reader.result as string;
      lines = csv.split('\n');
      this.fileLoaded.emit(lines);
    }
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
      this.selectContactFile({listName: '', contactsCount: 0, addedDate: ''})
    });
  }
}
