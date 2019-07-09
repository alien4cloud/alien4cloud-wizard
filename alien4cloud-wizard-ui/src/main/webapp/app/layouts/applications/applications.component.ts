import {Component, OnInit, ViewChild} from '@angular/core';
import { ApplicationsService } from "./applications.service";
import { Status } from "../../shared/a4c-payloads/status";
import { Application } from "../../shared/a4c-payloads/application.model";
import { CookieService } from 'ngx-cookie-service';
import { MyCookieService } from '../../shared/shared-cookie/mycookie.service';
import { MatPaginatorModule, MatPaginator } from '@angular/material';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';




@Component({
  selector: 'app-applications',
  templateUrl: './applications.component.html',
  styleUrls: ['./applications.component.css']
})
export class ApplicationsComponent implements OnInit {

    //public restApi;
    public state: string;
    public apps : Application[];
   // public displayApps : DisplayApps[];
    public displayedColumns :string[] = ['Application', 'Description', 'Etat'];
    public dataSource = new MatTableDataSource<Application>();
   // @ViewChild(MatSort) sort: MatSort;


   @ViewChild(MatSort, {static: true}) sort: MatSort;
    @ViewChild(MatPaginator,{static: true}) paginator: MatPaginator;

  constructor(
<<<<<<< HEAD:alien4cloud-wizard-ui/src/main/webapp/app/layouts/applications/applications.component.ts
    private restApi: ApplicationsService , 
=======
    private restApi: AppsService ,
>>>>>>> 4eb5245257ee729bba4be006a9548b800a760e38:alien4cloud-wizard-ui/src/main/webapp/app/layouts/apps/apps.component.ts
    private cookieService: CookieService,
    private myCookieService: MyCookieService) {
    restApi: ApplicationsService
  }

  ngOnInit() {
    this.cookieService.set( 'JSESSIONID', this.myCookieService.getCookie() );
    this.loadApplications() ;
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  // this.dataSource.filter = filterValue.trim().toLowerCase();
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
<<<<<<< HEAD:alien4cloud-wizard-ui/src/main/webapp/app/layouts/applications/applications.component.ts
     // this.apps = data['data']['data'];
      this.dataSource.data= data['data']['data'] as Application[];
      //alert("The new status is :"+this.state) ;         
      //console.log("THE FIRST APP NAME IS :"+this.apps[0].name) ;
=======
      this.apps = data['data']['data'];
      this.dataSource.data = data['data']['data'] as Application[];
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;

      //alert("The new status is :"+this.state) ;
      console.log("THE FIRST APP NAME IS :"+this.apps[0].name) ;
>>>>>>> 4eb5245257ee729bba4be006a9548b800a760e38:alien4cloud-wizard-ui/src/main/webapp/app/layouts/apps/apps.component.ts
    })
  }


<<<<<<< HEAD:alien4cloud-wizard-ui/src/main/webapp/app/layouts/applications/applications.component.ts

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  
=======
>>>>>>> 4eb5245257ee729bba4be006a9548b800a760e38:alien4cloud-wizard-ui/src/main/webapp/app/layouts/apps/apps.component.ts
/*
  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
  */

}


