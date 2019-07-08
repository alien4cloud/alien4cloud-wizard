import { Component, Input } from '@angular/core';
import { A4cThemeService } from './../../shared/a4c-theming/a4c-theme.service';

@Component({
  selector: 'solution-header',
  templateUrl: 'header.component.html'
})
export class HeaderComponent {
  // -----------------------------------------------------------------------//
  private title = 'Alien4Cloud';
  @Input() angularVersion: string = '';
  @Input() materialVersion: string = '';
  //private websiteUrl: string = 'https://iamfaisal.live/';  
  // -----------------------------------------------------------------------//
  constructor(private readonly _sharedDataService: A4cThemeService) { }

  onThemeChange(event){
    this._sharedDataService.OnThemeSwitch.next(event.checked);
  }
}

