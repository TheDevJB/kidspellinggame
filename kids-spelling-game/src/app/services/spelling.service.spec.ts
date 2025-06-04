import { TestBed } from '@angular/core/testing';

import { SpellingService } from './spelling.service';

describe('SpellingService', () => {
  let service: SpellingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SpellingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
