import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplatePropertiesEditorComponent } from './template-properties-editor.component';

describe('TemplatePropertiesEditorComponent', () => {
  let component: TemplatePropertiesEditorComponent;
  let fixture: ComponentFixture<TemplatePropertiesEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemplatePropertiesEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplatePropertiesEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
