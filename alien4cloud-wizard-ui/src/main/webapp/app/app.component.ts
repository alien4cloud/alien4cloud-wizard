import { Component, OnInit } from '@angular/core';
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  constructor (
    private translateService: TranslateService
  ) {}

  ngOnInit() {
    this.translateService.setDefaultLang("en");
  }
}
