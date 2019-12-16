import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalizationScreenComponent } from './localization-screen.component';

describe('LocalizationScreenComponent', () => {
  let component: LocalizationScreenComponent;
  let fixture: ComponentFixture<LocalizationScreenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocalizationScreenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalizationScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
