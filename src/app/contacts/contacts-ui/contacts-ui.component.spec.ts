import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactsUiComponent } from './contacts-ui.component';

describe('ContactsUiComponent', () => {
  let component: ContactsUiComponent;
  let fixture: ComponentFixture<ContactsUiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContactsUiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactsUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
