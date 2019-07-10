import { Component, OnInit, ViewChild ,Input } from '@angular/core';
import { ApplicationsService } from "./applications.service";
import { Status } from "../../shared/a4c-payloads/status";
import { Application } from "../../shared/a4c-payloads/application.model";
import { CookieService } from 'ngx-cookie-service';
import { MyCookieService } from '../../shared/shared-cookie/mycookie.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
//import { animate, state, style, transition, trigger } from '@angular/animations';



/* CONSTANTS */
const initialSelection = [];
const allowMultiSelect = true;


@Component({
  selector: 'app-applications',
  templateUrl: './applications.component.html',
  styleUrls: ['./applications.component.css'],
  /*
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]*/
})
export class ApplicationsComponent implements OnInit {


  public state: string;
  public apps: Application[];
  public displayedColumns: string[] = ['select','name', 'id', 'Etat'];

  /* Sort */
  public dataSource = new MatTableDataSource<Application>();
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  /* pagination */
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  /* selection */
  selection = new SelectionModel<Application>(allowMultiSelect, initialSelection);
  //theCheckbox = false;
  //marked = false;
  //@Input ("Selected") isSelecteded : boolean ;
  //selection = new SelectionModel<Application>(true, []);




  constructor(
    private restApi: ApplicationsService,
    private cookieService: CookieService,
    private myCookieService: MyCookieService) {
    restApi: ApplicationsService
  }

  ngOnInit() {
    this.cookieService.set('JSESSIONID', this.myCookieService.getCookie());
    this.loadApplications();
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.loadStatus();

  }

  /*
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  } */


  // Get status
  loadStatus() {
    return this.restApi.getStatus().subscribe((data: Status) => {
      this.state = data.status;
      console.log("The new status is :" + this.state);
    })
  }

  // Get applications list
  loadApplications() {
    return this.restApi.getApplications().subscribe((data: {}) => {
      this.apps = data['data']['data'];
      this.dataSource.data = data['data']['data'] as Application[];
    })
  }


  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  cellClicked(element) {
    console.log(element.name + ' cell clicked');
  }



  /* *
      HANDLE SELECTIONS
  */

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: Application): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.name + 1}`;
  }

  
  isAppSelected() {
    //return this.checked ;
    return true
    //return this.marked ;
  }

 /*   
  toggleVisibility(e){
    this.marked= e.target.checked;
  }
*/


}


