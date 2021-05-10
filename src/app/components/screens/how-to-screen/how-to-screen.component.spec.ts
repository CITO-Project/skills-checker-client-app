import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HowToScreenComponent } from './how-to-screen.component';

describe('HowToScreenComponent', () => {
  let component: HowToScreenComponent;
  let fixture: ComponentFixture<HowToScreenComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ HowToScreenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HowToScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
