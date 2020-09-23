import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeploymentStatusPiechartComponent } from './deployment-status-piechart.component';

describe('DeploymentStatusPiechartComponent', () => {
  let component: DeploymentStatusPiechartComponent;
  let fixture: ComponentFixture<DeploymentStatusPiechartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeploymentStatusPiechartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeploymentStatusPiechartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
