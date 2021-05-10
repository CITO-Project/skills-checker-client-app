import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ScenarioIntroductionScreenComponent } from './scenario-introduction-screen.component';

describe('ScenarioIntroductionScreenComponent', () => {
  let component: ScenarioIntroductionScreenComponent;
  let fixture: ComponentFixture<ScenarioIntroductionScreenComponent>;

  beforeEach(waitForAsync(() => {
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
