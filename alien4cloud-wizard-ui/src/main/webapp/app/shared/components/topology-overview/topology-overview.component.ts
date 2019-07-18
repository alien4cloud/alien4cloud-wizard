import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatTabChangeEvent } from '@angular/material';
import { TopologyOverview, MetaProperty, ApplicationModule } from "@app/core";


@Component({
  selector: 'w4c-topology-overview',
  templateUrl: './topology-overview.component.html',
  styleUrls: ['./topology-overview.component.scss']
})
export class TopologyOverviewComponent implements OnInit {

  @Input() overview: TopologyOverview;

  constructor(private router: Router) { }

  // usefull of we display metaproperties in a table
  // displayedColumns = ['description', 'name', 'value'];
  // TODO: will be moved in TopologyOverviewComponent
  modulesDisplayedColumns = ['icon', 'name', 'version', 'metaproperties'];

  ngOnInit() {
  }

  mainTabSelected(event: MatTabChangeEvent) {
    console.log(event);
    // if (event.index === 1) {
    //   this.router.navigate([{ outlets: { popup: ['topology-graph', 'foo', 'bar'] }}]);
    //   // this.router.navigate([{ outlets: { topology-graph-outlet: ['topology-graph', 'foo', 'bar'] }}]);
    //   // this.router.navigate(['topology-graph', 'foo', 'bar']);
    // }
  }

}
