import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignPostComponent } from './sign-post.component';

describe('SignPostComponent', () => {
  let component: SignPostComponent;
  let fixture: ComponentFixture<SignPostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignPostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
