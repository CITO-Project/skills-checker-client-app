import { TestBed } from '@angular/core/testing';

import { StringManagerService } from './string-manager.service';

describe('StringManagerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StringManagerService = TestBed.get(StringManagerService);
    expect(service).toBeTruthy();
  });
});
