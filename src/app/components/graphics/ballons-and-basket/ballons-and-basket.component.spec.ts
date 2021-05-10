import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BallonsAndBasketComponent } from './ballons-and-basket.component';

describe('BallonsAndBasketComponent', () => {
  let component: BallonsAndBasketComponent;
  let fixture: ComponentFixture<BallonsAndBasketComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BallonsAndBasketComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BallonsAndBasketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
