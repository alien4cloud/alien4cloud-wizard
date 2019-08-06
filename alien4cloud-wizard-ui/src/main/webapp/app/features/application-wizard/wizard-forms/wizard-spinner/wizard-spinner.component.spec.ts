import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WizardSpinnerComponent } from './wizard-spinner.component';

describe('WizardSpinnerComponent', () => {
  let component: WizardSpinnerComponent;
  let fixture: ComponentFixture<WizardSpinnerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WizardSpinnerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WizardSpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
