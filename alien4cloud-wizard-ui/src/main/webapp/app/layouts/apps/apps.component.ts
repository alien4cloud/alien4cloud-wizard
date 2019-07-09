import { Component, OnInit, ViewChild } from '@angular/core';
import { AppsService } from "./apps.service";
import { Status } from "../../shared/a4c-payloads/status";
import { Application } from "../../shared/a4c-payloads/application.model";
import { CookieService } from 'ngx-cookie-service';
import { MyCookieService } from '../../shared/shared-cookie/mycookie.service';
import { MatTableDataSource,MatPaginatorModule, MatPaginator } from '@angular/material';
import {MatSort} from '@angular/material/sort';
//import {Sort} from '@angular/material/sort';




@Component({
  selector: 'app-apps',
  templateUrl: './apps.component.html',
  styleUrls: ['./apps.component.css']
})
export class AppsComponent implements OnInit {

    //public restApi;
    public state: string;
    public apps : Application[];
   // public displayApps : DisplayApps[];
    public displayedColumns = ['Application', 'Description', 'Etat'];
    public dataSource = new MatTableDataSource<Application>();
   // @ViewChild(MatSort) sort: MatSort;

   @ViewChild(MatSort, {static: true}) sort: MatSort;
    @ViewChild(MatPaginator,{static: true}) paginator: MatPaginator;

  constructor(
    private restApi: AppsService ,
    private cookieService: CookieService,
    private myCookieService: MyCookieService) {
    restApi: AppsService
  }

  ngOnInit() {
    this.cookieService.set( 'JSESSIONID', this.myCookieService.getCookie() );
    this.loadApplications() ;
    //this.dataSource.sort = this.sort;
    this.loadStatus();

  }

  ngAfterViewInit(): void {
    //this.dataSource.sort = this.sort;
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
      this.dataSource.data = data['data']['data'] as Application[];
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;

      //alert("The new status is :"+this.state) ;
      console.log("THE FIRST APP NAME IS :"+this.apps[0].name) ;
    })
  }


/*
  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
  */

}


