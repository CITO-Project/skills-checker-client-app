import { TestBed } from '@angular/core/testing';

import { CanvasManagerService } from './canvas-manager.service';

describe('CanvasManagerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CanvasManagerService = TestBed.get(CanvasManagerService);
    expect(service).toBeTruthy();
  });
});
