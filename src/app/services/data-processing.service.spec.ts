import { TestBed } from '@angular/core/testing';

import { DataProcessingService } from './data-processing.service';

describe('ResultsProcessingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DataProcessingService = TestBed.get(DataProcessingService);
    expect(service).toBeTruthy();
  });
});
