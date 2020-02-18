import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScenariosScreenComponent } from './scenarios-screen.component';

describe('ScenariosScreenComponent', () => {
  let component: ScenariosScreenComponent;
  let fixture: ComponentFixture<ScenariosScreenComponent>;

  beforeEach(async(() => {
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
