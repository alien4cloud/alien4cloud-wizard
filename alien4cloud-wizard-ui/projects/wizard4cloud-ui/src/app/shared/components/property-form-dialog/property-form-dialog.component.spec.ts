import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyFormDialogComponent } from './property-form-dialog.component';

describe('PropertyFormDialogComponent', () => {
  let component: PropertyFormDialogComponent;
  let fixture: ComponentFixture<PropertyFormDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PropertyFormDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertyFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
