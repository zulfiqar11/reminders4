import { Component, EventEmitter, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ContactsList } from 'src/app/shared/model/contact';
import { DataService } from 'src/app/shared/services/data.service';

@Component({
  selector: 'app-contacts-file-list',
  templateUrl: './contacts-file-list.component.html',
  styleUrls: ['./contacts-file-list.component.css']
})
export class ContactsFileListComponent implements OnInit {

  displayedColumnsContactsList: string[] = ['id', 'listName', 'contactsCount', 'addedDate'];
  contactsFiles$!: Observable<ContactsList[]>;
  fileLoaded = new EventEmitter<string[]>();
  mylines: string[] = [];
  contact: string[] = [];
  fileName: string = '';
  fileRecordCount: number = 0

  constructor(private dataService: DataService<ContactsList>) {
    this.dataService.Url('api/contactsList');
  }

  ngOnInit(): void {

    this.contactsFiles$ = this.dataService.get();

    this.fileLoaded.subscribe((lines: string[]) => {
      this.mylines = lines;
//       console.log('2nd lines -> ', lines[2]);
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

