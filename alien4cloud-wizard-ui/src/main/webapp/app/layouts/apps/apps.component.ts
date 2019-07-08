import { Component, OnInit } from '@angular/core';
import { AppsService } from "./apps.service";
import { Status } from "../../shared/a4c-payloads/status";
import { Application } from "../../shared/a4c-payloads/application.model";
import { CookieService } from 'ngx-cookie-service';
import { MyCookieService } from '../../shared/shared-cookie/mycookie.service';

@Component({
  selector: 'app-apps',
  templateUrl: './apps.component.html',
  styleUrls: ['./apps.component.css']
})
export class AppsComponent implements OnInit {

    //public restApi;
    public state: string;
    public apps : Application[];

  constructor(
    private restApi: AppsService , 
    private cookieService: CookieService,
    private myCookieService: MyCookieService) {
    restApi: AppsService
  }

  ngOnInit() {
    this.cookieService.set( 'JSESSIONID', this.myCookieService.getCookie() );
    this.loadApplications() ;
    this.loadStatus();
 
  }


  // Get status
  loadStatus() {
    return this.restApi.getStatus().subscribe((data: Status) => {
      this.state = data.status;
      //alert("The new status is :"+this.state) ;         
      console.log("The new status is :"+this.state) ;
    })
  }

    // Get employees list
  loadApplications() {
    return this.restApi.getApplications().subscribe((data: {}) => {
      this.apps = data['data']['data'];
      //alert("The new status is :"+this.state) ;         
      console.log("THE FIRST APP NAME IS :"+this.apps[0].name) ;
    })
  } 

}


