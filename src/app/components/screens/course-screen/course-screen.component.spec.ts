import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseScreenComponent } from './course-screen.component';

describe('CourseScreenComponent', () => {
  let component: CourseScreenComponent;
  let fixture: ComponentFixture<CourseScreenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CourseScreenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
