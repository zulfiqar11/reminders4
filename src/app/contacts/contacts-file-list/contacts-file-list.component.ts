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

  //TODO: refactor following to strong datatype
  contactsFiles$!: Observable<ContactsListDisplay[]>;
  contactNames$!: Observable<any[]>;

  fileLoaded = new EventEmitter<string[]>();
  fileDelete = new EventEmitter<ContactsList>();

  //TODO: refactor variable names and just review them.
  fileName: string = '';

  constructor(private dataService: DataService<ContactsList>, private http: HttpClient) {
    this.dataService.Url('api/contactsList');
  }

  ngOnInit(): void {

    this.contactsFiles$! = this.getContactsDistinctListData();

    this.fileLoaded.subscribe((lines: string[]) => {

      // TODO: dont add the header line, manage the correct Id, when all done refresh the grid, the addedDate is hardcoded.
      let theId = 7

      lines.forEach(line => {
        let contact = line.split('\t');

        theId = theId + 1;
        let contactList: ContactsList = {
            id: theId,
            listName : this.fileName,
            contactsCount: (lines.length - 1),
            addedDate: '11/01/2021 04:55 AM',
            firstName: contact[0],
            lastName: contact[1],
            phone: contact[2],
            email: contact[3]
        };
        console.log('contact -> ', contactList);
        this.dataService.create(contactList).subscribe(data => data);

      })
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
    ).subscribe(data => this.contactNames$ = of(data));
  }

  public changeListener() {
    let lines: string[] = [];
    let file = (<HTMLInputElement>document.getElementById('fileUpload')).files![0];
    let reader: FileReader = new FileReader();
    reader.readAsText(file!);
    this.fileName = file!.name;

    reader.onload = (e) => {
      let csv: string = reader.result as string;
      lines = csv.split('\n');
      this.fileLoaded.emit(lines);
    }
  }

  onDelete() {
    this.dataService.get().subscribe(files => {
      files.map(file => {
          if (file.listName === this.selectedContactFile.listName) {
            // TODO: add a spinner here.
            this.dataService.delete(file, file.id).subscribe(data => console.log('deleted', data));
          }
      })
      this.contactsFiles$! = this.getContactsDistinctListData();
      this.selectContactFile({listName: '', contactsCount: 0, addedDate: ''})
    });
  }
}
