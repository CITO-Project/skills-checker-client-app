import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ResultsScreenComponent } from './results-screen.component';

describe('ResultsScreenComponent', () => {
  let component: ResultsScreenComponent;
  let fixture: ComponentFixture<ResultsScreenComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ResultsScreenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultsScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
