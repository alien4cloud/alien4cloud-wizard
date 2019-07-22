import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TargetSelectionComponent } from './target-selection.component';

describe('TargetSelectionComponent', () => {
  let component: TargetSelectionComponent;
  let fixture: ComponentFixture<TargetSelectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TargetSelectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TargetSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
