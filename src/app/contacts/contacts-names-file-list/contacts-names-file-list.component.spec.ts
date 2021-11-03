import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactsNamesFileListComponent } from './contacts-names-file-list.component';

describe('ContactsNamesFileListComponent', () => {
  let component: ContactsNamesFileListComponent;
  let fixture: ComponentFixture<ContactsNamesFileListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContactsNamesFileListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactsNamesFileListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
