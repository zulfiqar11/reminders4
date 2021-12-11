import { TestBed } from '@angular/core/testing';

import { ButtonuiService } from './buttonui.service';

describe('ButtonuiService', () => {
  let service: ButtonuiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ButtonuiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
