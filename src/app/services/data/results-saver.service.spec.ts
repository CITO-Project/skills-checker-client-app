import { TestBed } from '@angular/core/testing';

import { ResultsSaverService } from './results-saver.service';

describe('ResultsSaverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ResultsSaverService = TestBed.get(ResultsSaverService);
    expect(service).toBeTruthy();
  });
});
