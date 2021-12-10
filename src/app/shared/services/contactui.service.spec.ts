import { TestBed } from '@angular/core/testing';

import { ContactuiService } from './contactui.service';

describe('ContactuiService', () => {
  let service: ContactuiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContactuiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
