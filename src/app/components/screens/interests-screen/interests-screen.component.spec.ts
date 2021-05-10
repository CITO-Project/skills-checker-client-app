import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { InterestsScreenComponent } from './interests-screen.component';

describe('InterestsScreenComponent', () => {
  let component: InterestsScreenComponent;
  let fixture: ComponentFixture<InterestsScreenComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ InterestsScreenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InterestsScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
