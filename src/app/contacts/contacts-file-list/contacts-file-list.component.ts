import { Component, EventEmitter, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { distinct, map, tap } from 'rxjs/operators';
import { ContactsList } from 'src/app/shared/model/contact';
import { DataService } from 'src/app/shared/services/data.service';

@Component({
  selector: 'app-contacts-file-list',
  templateUrl: './contacts-file-list.component.html',
  styleUrls: ['./contacts-file-list.component.css']
})
export class ContactsFileListComponent implements OnInit {

  displayedColumnsContactsList: string[] = ['listName', 'contactsCount', 'addedDate'];
  displayedColumnsContactNames: string[] = ['firstName', 'lastName', 'phone', 'email'];

  //TODO: refactor following to strong datatype
  contactsFiles$!: Observable<any[]>;
  contactNames$!: Observable<any[]>;

  fileLoaded = new EventEmitter<string[]>();
  mylines: string[] = [];
  contact: string[] = [];
  fileName: string = '';
  fileRecordCount: number = 0

  constructor(private dataService: DataService<ContactsList>) {
    this.dataService.Url('api/contactsList');
  }

  ngOnInit(): void {

    // TODO: refactor to better map operator
    this.dataService.get().pipe(
        map(contactsfiles => {
            return contactsfiles.map(contactFile => {
              return ({
                listName: contactFile.listName,
                contactsCount: contactFile.contactsCount,
                addedDate: contactFile.addedDate
              })
            })
           })
      )
      .subscribe(data => {
                  data = data.filter((thing, index, self) =>
                    index === self.findIndex((t) => (
                      t.listName === thing.listName
                          && t.contactsCount === thing.contactsCount
                          && t.addedDate === thing.addedDate))
                )
          this.contactsFiles$! = of(data);
      })

    this.fileLoaded.subscribe((lines: string[]) => {
      this.mylines = lines;
      // TODO: refactor /r out of email address
      this.contact = lines[2].split('\t');
      this.fileRecordCount = lines.length;

      console.log('filename ', this.fileName);
      console.log('lines count -> ', lines.length - 1);
      console.log('this.contact', this.contact);
      let contactList: ContactsList = {
        id: 11,
        listName : this.fileName,
        contactsCount: (lines.length - 1),
        addedDate: '11/01/2021 04:55 AM',
        firstName: this.contact[0],
        lastName: this.contact[1],
        phone: this.contact[2],
        email: this.contact[3]
      };
      console.log('contactList', contactList);
      this.dataService.get().subscribe(list => console.log('before', list));
      this.dataService.create(contactList);
      // this.dataService.get().subscribe(list => console.log(JSON.stringify(list)));
      this.dataService.get().subscribe(list => console.log('after', list));

    })
  }

  selectContactFile(selectedFile: {listName: string, recordCount: number, dateAdded: string}) {

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
}

