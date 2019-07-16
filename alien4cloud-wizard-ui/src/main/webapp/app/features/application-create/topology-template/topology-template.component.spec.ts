import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopologyTemplateComponent } from './topology-template.component';

describe('ApplicationModeleComponent', () => {
  let component: TopologyTemplateComponent;
  let fixture: ComponentFixture<TopologyTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopologyTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopologyTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
