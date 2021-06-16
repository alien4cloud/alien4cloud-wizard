import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeploymentValidationComponent } from './deployment-validation.component';

describe('DeploymentValidationComponent', () => {
  let component: DeploymentValidationComponent;
  let fixture: ComponentFixture<DeploymentValidationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeploymentValidationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeploymentValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
