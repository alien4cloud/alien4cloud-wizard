import { Component, OnInit ,VERSION} from '@angular/core';
import { A4cThemeService } from '../../shared/a4c-theming/a4c-theme.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent {

  
  title = 'Alien4cloud';

  private ngVersion: string = VERSION.full;
  private isDarkThemeActive: boolean;

  constructor(private readonly _sharedDataService: A4cThemeService) {
    this._sharedDataService.OnThemeSwitch.subscribe(value => {
      this.isDarkThemeActive = value;
    });
  }

}
