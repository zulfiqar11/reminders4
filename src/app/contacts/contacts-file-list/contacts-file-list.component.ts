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
  contactsFiles$!: Observable<any[]>;
  fileLoaded = new EventEmitter<string[]>();
  mylines: string[] = [];
  contact: string[] = [];
  fileName: string = '';
  fileRecordCount: number = 0

  constructor(private dataService: DataService<ContactsList>) {
    this.dataService.Url('api/contactsList');
  }

  ngOnInit(): void {

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
      this.contact = lines[2].split('\t');
      this.fileRecordCount = lines.length;

      console.log('filename ', this.fileName);
      console.log('lines count -> ', lines.length - 1);
      console.log('this.contact', this.contact);
    })
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

