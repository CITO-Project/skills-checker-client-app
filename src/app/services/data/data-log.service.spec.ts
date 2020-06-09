import { TestBed } from '@angular/core/testing';

import { DataLogService } from './data-log.service';

describe('TestResultsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DataLogService = TestBed.get(DataLogService);
    expect(service).toBeTruthy();
  });
});
