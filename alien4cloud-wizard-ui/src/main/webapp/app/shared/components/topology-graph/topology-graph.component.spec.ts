import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopologyGraphComponent } from './topology-graph.component';

describe('TopologyGraphComponent', () => {
  let component: TopologyGraphComponent;
  let fixture: ComponentFixture<TopologyGraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopologyGraphComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopologyGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
