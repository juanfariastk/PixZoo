import { TestBed } from '@angular/core/testing';

import { AdminFireService } from './admin-fire.service';

describe('AdminFireService', () => {
  let service: AdminFireService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminFireService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
