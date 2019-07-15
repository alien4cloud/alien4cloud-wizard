import { Component, OnInit, ViewChild ,Input } from '@angular/core';
import { Application, ApplicationsService, MetapropertyService, Metaproperty} from "@app/core";
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
  public metas: Metaproperty[];
  public displayedColumns: string[] = ['select','name', 'description', 'Etat'];

  /* Sort */
  public dataSource = new MatTableDataSource<Application>();
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  /* pagination */
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  /* selection */
  selection = new SelectionModel<Application>(allowMultiSelect, initialSelection);

   /* recuperation metatproperties */
   targetAppsLocations :string[] = ["application","location"]
   targetApps :string[] = ["application"]






  constructor(
    private restApi: ApplicationsService,
    private metapropertiesService: MetapropertyService
    ) {
    restApi: ApplicationsService
  }

  ngOnInit() {
    this.loadApplications();
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    //this.loadStatus();
    this.loadMetaproperties(this.targetApps) ;

  }

  /*
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  } */


  /*
  loadStatus() {
    return this.restApi.getStatus().subscribe((data: Status) => {
      this.state = data.status;
      console.log("The new status is :" + this.state);
    })
  }
  */

  // Get applications list
  loadApplications() {
    return this.restApi.getApplications().subscribe((data: {}) => {
      this.apps = data['data']['data'];
      this.dataSource.data = data['data']['data'] as Application[];
    })
  }

    // Get applications metaproperties
    loadMetaproperties(metas:string[]) {
      return this.metapropertiesService.getMetaproperties(metas).subscribe((data: {}) => {
        this.metas = data['data']['data'];
        console.log("The first meta is : "+this.metas[0].name) ;

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

}
