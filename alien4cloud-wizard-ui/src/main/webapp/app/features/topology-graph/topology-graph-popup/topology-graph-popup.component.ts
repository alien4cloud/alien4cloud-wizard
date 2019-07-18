import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ApplicationsService, TopologyGraph } from "@app/core";

export interface DialogData {
  topologyId: string;
  topologyVersion: string;
}

@Component({
  selector: 'w4c-topology-graph-popup',
  templateUrl: './topology-graph-popup.component.html',
  styleUrls: ['./topology-graph-popup.component.scss']
})
export class TopologyGraphPopupComponent implements OnInit {

  private topologyGraph: TopologyGraph;

  constructor(
    private dialogRef: MatDialogRef<TopologyGraphPopupComponent>,
    @Inject(MAT_DIALOG_DATA) private data: DialogData,
    private applicationsService: ApplicationsService
  ) { }

  ngOnInit() {
    this.topologyGraph = undefined;
    this.applicationsService.getTopologyGraph(this.data.topologyId, this.data.topologyVersion).subscribe((data: {}) => {
      this.topologyGraph = data['data'] as TopologyGraph;
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
