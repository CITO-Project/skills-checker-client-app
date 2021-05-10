import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ScenariosScreenComponent } from './scenarios-screen.component';

describe('ScenariosScreenComponent', () => {
  let component: ScenariosScreenComponent;
  let fixture: ComponentFixture<ScenariosScreenComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ScenariosScreenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScenariosScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
