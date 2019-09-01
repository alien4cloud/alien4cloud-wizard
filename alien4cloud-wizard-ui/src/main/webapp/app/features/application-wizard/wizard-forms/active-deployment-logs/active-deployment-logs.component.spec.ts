import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveDeploymentLogsComponent } from './active-deployment-logs.component';

describe('ActiveDeploymentLogsComponent', () => {
  let component: ActiveDeploymentLogsComponent;
  let fixture: ComponentFixture<ActiveDeploymentLogsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActiveDeploymentLogsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActiveDeploymentLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
