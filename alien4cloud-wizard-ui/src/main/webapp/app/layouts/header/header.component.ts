import { Component, Input } from '@angular/core';


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
  constructor() { }

}

