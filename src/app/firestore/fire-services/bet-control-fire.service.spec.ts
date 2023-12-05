import { TestBed } from '@angular/core/testing';

import { BetControlFireService } from './bet-control-fire.service';

describe('BetControlFireService', () => {
  let service: BetControlFireService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BetControlFireService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
