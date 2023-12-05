import { TestBed } from '@angular/core/testing';

import { AnimalsControlFireService } from './animals-control-fire.service';

describe('AnimalsControlFireService', () => {
  let service: AnimalsControlFireService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnimalsControlFireService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
