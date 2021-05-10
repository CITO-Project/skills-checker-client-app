import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NavigateButtonComponent } from './navigate-button.component';

describe('NavigateButtonComponent', () => {
  let component: NavigateButtonComponent;
  let fixture: ComponentFixture<NavigateButtonComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NavigateButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavigateButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
