import { TestBed } from '@angular/core/testing';

import { ScoringService } from './scoring.service';

describe('ScoringService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ScoringService = TestBed.get(ScoringService);
    expect(service).toBeTruthy();
  });
});
