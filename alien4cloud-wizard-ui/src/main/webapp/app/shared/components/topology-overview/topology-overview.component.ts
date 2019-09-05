import {Component, Input, ViewEncapsulation} from '@angular/core';
import {Router} from '@angular/router';
import {TopologyOverview} from "@app/core";

@Component({
  selector: 'w4c-topology-overview',
  templateUrl: './topology-overview.component.html',
  styleUrls: ['./topology-overview.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TopologyOverviewComponent {

  @Input() overview: TopologyOverview;

  constructor(
    private router: Router) {
  }

  modulesDisplayedColumns = ['icon', 'nodeName', 'typeName', 'metaproperties'];

  /**
   * Inidicates if the graph view should be displayed.
   */
  displayGraph: boolean;

  /**
   * Activate/Deactivate the graph view.
   * The 'displayGraph' boolean will trigger lazy load of TopologyGraphModule using 'hero-loader' selector.
   */
  switchGraphView() {
    this.displayGraph = !this.displayGraph;
  }

}
