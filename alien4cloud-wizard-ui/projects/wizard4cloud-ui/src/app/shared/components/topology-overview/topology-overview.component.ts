import {Component, Input, ViewEncapsulation} from '@angular/core';
import {Router} from '@angular/router';
import {ApplicationOverview, TopologyOverview} from "@app/core/models";
import * as _ from 'lodash';

@Component({
  selector: 'w4c-topology-overview',
  templateUrl: './topology-overview.component.html',
  styleUrls: ['./topology-overview.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TopologyOverviewComponent {

  @Input() overview: TopologyOverview;

  // make lodash usable from template
  private lodash = _;

  constructor(
    private router: Router) {
  }

  getId(overview: TopologyOverview) {
    if ((overview as ApplicationOverview).application) {
      return (<ApplicationOverview>overview).application.id;
    } else {
      return (<TopologyOverview>overview).topologyDTO.topology.id;
    }
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
