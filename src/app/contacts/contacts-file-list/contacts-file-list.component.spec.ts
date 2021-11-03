import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactsFileListComponent } from './contacts-file-list.component';

describe('ContactsFileListComponent', () => {
  let component: ContactsFileListComponent;
  let fixture: ComponentFixture<ContactsFileListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContactsFileListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactsFileListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
