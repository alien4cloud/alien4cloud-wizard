import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPropertyEditorComponent } from './list-property-editor.component';

describe('ListPropertyEditorComponent', () => {
  let component: ListPropertyEditorComponent;
  let fixture: ComponentFixture<ListPropertyEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListPropertyEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListPropertyEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
