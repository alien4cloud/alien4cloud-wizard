import { Component, Input } from '@angular/core';
import { A4cThemeService } from '@app/core';

@Component({
  selector: 'solution-header',
  templateUrl: 'header.component.html'
})
export class HeaderComponent {
  // -----------------------------------------------------------------------//
  public title = 'Alien4Cloud';
  @Input() angularVersion: string = '';
  @Input() materialVersion: string = '';
  //private websiteUrl: string = 'https://iamfaisal.live/';

  public isActive : boolean = true;
  // -----------------------------------------------------------------------//
  constructor(private readonly _sharedDataService: A4cThemeService) { }

  onThemeChange(event){
    this._sharedDataService.OnThemeSwitch.next(event.checked);
  }
}

