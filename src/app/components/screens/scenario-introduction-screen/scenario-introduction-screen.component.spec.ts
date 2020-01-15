import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScenarioIntroductionScreenComponent } from './scenario-introduction-screen.component';

describe('ScenarioIntroductionScreenComponent', () => {
  let component: ScenarioIntroductionScreenComponent;
  let fixture: ComponentFixture<ScenarioIntroductionScreenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScenarioIntroductionScreenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScenarioIntroductionScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
