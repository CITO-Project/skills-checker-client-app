import { TestBed } from '@angular/core/testing';

import { QuestionOrderService } from './question-order.service';

describe('QuestionOrderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: QuestionOrderService = TestBed.get(QuestionOrderService);
    expect(service).toBeTruthy();
  });
});
