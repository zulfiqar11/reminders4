import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HisformComponent } from './hisform.component';

describe('HisformComponent', () => {
  let component: HisformComponent;
  let fixture: ComponentFixture<HisformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HisformComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HisformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
