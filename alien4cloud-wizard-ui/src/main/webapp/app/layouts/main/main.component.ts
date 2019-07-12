import { Component, OnInit ,VERSION} from '@angular/core';
import { A4cThemeService } from '@app/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent {


  title = 'Alien4cloud';

  public ngVersion: string = VERSION.full;
  public isDarkThemeActive: boolean;

  constructor(private readonly _sharedDataService: A4cThemeService) {
    this._sharedDataService.OnThemeSwitch.subscribe(value => {
      this.isDarkThemeActive = value;
    });
  }

}

