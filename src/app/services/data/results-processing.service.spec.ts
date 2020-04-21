import { TestBed } from '@angular/core/testing';

import { ResultsProcessingService } from './results-processing.service';

describe('ResultsProcessingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ResultsProcessingService = TestBed.get(ResultsProcessingService);
    expect(service).toBeTruthy();
  });
});
