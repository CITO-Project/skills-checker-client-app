import { TestBed } from '@angular/core/testing';

import { ResultsVisualizationService } from './results-visualization.service';

describe('ResultsVisualizationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ResultsVisualizationService = TestBed.get(ResultsVisualizationService);
    expect(service).toBeTruthy();
  });
});
