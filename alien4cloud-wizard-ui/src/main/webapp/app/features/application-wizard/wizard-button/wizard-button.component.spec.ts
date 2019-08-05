import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WizardButtonComponent } from './wizard-button.component';

describe('WizardButtonComponent', () => {
  let component: WizardButtonComponent;
  let fixture: ComponentFixture<WizardButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WizardButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WizardButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
