import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FsmGraphViewerComponent } from './fsm-graph-viewer.component';

describe('FsmGraphViewerComponent', () => {
  let component: FsmGraphViewerComponent;
  let fixture: ComponentFixture<FsmGraphViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FsmGraphViewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FsmGraphViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
