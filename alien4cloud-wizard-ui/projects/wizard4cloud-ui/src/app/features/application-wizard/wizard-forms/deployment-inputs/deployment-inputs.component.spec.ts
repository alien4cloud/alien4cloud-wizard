import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeploymentInputsComponent } from './deployment-inputs.component';

describe('DeploymentInputsComponent', () => {
  let component: DeploymentInputsComponent;
  let fixture: ComponentFixture<DeploymentInputsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeploymentInputsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeploymentInputsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
