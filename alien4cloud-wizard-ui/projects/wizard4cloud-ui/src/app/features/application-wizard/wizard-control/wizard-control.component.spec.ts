import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WizardControlComponent } from './wizard-control.component';

describe('WizardControlComponent', () => {
  let component: WizardControlComponent;
  let fixture: ComponentFixture<WizardControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WizardControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WizardControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
