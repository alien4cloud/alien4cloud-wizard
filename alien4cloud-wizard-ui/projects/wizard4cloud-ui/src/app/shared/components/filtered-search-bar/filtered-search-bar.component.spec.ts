import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilteredSearchBarComponent } from './filtered-search-bar.component';

describe('FilteredSearchBarComponent', () => {
  let component: FilteredSearchBarComponent;
  let fixture: ComponentFixture<FilteredSearchBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilteredSearchBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilteredSearchBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
