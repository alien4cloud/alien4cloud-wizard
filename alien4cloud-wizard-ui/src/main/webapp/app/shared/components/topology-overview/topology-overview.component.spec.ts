import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopologyOverviewComponent } from './topology-overview.component';

describe('TopologyOverviewComponent', () => {
  let component: TopologyOverviewComponent;
  let fixture: ComponentFixture<TopologyOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopologyOverviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopologyOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
