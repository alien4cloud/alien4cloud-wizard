import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NodesMatchingComponent } from './nodes-matching.component';

describe('NodesMatchingComponent', () => {
  let component: NodesMatchingComponent;
  let fixture: ComponentFixture<NodesMatchingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NodesMatchingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NodesMatchingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
