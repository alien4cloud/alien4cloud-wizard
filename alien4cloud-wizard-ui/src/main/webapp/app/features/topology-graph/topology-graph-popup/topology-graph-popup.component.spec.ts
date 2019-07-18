import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopologyGraphPopupComponent } from './topology-graph-popup.component';

describe('TopologyGraphPopupComponent', () => {
  let component: TopologyGraphPopupComponent;
  let fixture: ComponentFixture<TopologyGraphPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopologyGraphPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopologyGraphPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
