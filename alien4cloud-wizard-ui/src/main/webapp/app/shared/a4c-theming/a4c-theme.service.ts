import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class A4cThemeService {
  public OnThemeSwitch: Subject<boolean> = new Subject<boolean>();
}

