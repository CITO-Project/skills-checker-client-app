import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphicGeneratorComponent } from './graphic-generator.component';

describe('GraphicGeneratorComponent', () => {
  let component: GraphicGeneratorComponent;
  let fixture: ComponentFixture<GraphicGeneratorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GraphicGeneratorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphicGeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
