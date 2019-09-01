import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowGraphViewerComponent } from './workflow-graph-viewer.component';

describe('WorkflowGraphViewerComponent', () => {
  let component: WorkflowGraphViewerComponent;
  let fixture: ComponentFixture<WorkflowGraphViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkflowGraphViewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkflowGraphViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
