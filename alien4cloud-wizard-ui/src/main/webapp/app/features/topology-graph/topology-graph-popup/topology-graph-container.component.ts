import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { TopologyGraphPopupComponent } from './topology-graph-popup.component';

@Component({
  selector: 'w4c-topology-graph-container',
  template: ''
})
export class TopologyGraphContainerComponent implements OnInit, OnDestroy {

  destroy = new Subject<any>();
  currentDialog = null;

  constructor(
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.route.params.pipe(takeUntil(this.destroy)).subscribe(params => {
        console.log("Topolog: " + params.topologyId);
        this.openDialog(params.topologyId, params.topologyVersion);
    });

  }

  openDialog(topologyId: string, topologyVersion: string): void {
    const dialogRef = this.dialog.open(TopologyGraphPopupComponent, {
      width: '800px',
      height: '600px',
      data: {topologyId: topologyId, topologyVersion: topologyVersion}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  ngOnDestroy() {
    this.destroy.next();
  }

}
