import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteApplicationFormComponent } from './delete-application-form.component';

describe('DeleteApplicationFormComponent', () => {
  let component: DeleteApplicationFormComponent;
  let fixture: ComponentFixture<DeleteApplicationFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteApplicationFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteApplicationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
