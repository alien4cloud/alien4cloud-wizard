import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowProgressBarComponent } from './workflow-progress-bar.component';

describe('WorkflowProgressBarComponent', () => {
  let component: WorkflowProgressBarComponent;
  let fixture: ComponentFixture<WorkflowProgressBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkflowProgressBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkflowProgressBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
