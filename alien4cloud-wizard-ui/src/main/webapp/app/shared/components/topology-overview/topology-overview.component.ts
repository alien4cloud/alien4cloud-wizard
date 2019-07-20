import {Component, Input} from '@angular/core';
import {Router} from '@angular/router';
import {TopologyOverview, TopologyGraphService} from "@app/core";

@Component({
  selector: 'w4c-topology-overview',
  templateUrl: './topology-overview.component.html',
  styleUrls: ['./topology-overview.component.scss']
})
export class TopologyOverviewComponent {

  @Input() overview: TopologyOverview;

  constructor(
    private router: Router,
    private topologyGraphService: TopologyGraphService) {
  }

  modulesDisplayedColumns = ['icon', 'name', 'version', 'metaproperties'];

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
    if (this.displayGraph) {
      this.topologyGraphService.setTopology(this.overview.topologyId, this.overview.topologyVersion);
    }
  }

}
