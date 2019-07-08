import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { MyCookieService } from '../shared/shared-cookie/mycookie.service';
import { RestApiService } from "../shared/a4c-rest-api/rest-api.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(
    private restApi: RestApiService,
    private cookieService: CookieService,
    private myCookieService: MyCookieService
  ) { }

  ngOnInit() {
    this.cookieService.set('JSESSIONID', this.myCookieService.getCookie());
    this.loadApplications();
  }

  // Get employees list
  loadApplications() {
    this.restApi.getApplications();
  }


}
