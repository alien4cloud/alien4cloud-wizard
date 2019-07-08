import { TestBed } from '@angular/core/testing';

import { A4cThemeService } from './a4c-theme.service';

describe('A4cThemeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: A4cThemeService = TestBed.get(A4cThemeService);
    expect(service).toBeTruthy();
  });
});
