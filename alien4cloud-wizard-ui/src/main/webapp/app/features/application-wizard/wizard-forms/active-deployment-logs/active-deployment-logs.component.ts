import {Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ApplicationWizardMachineContext} from "@app/features/application-wizard/core/fsm.model";
import {ApplicationLogService, SearchLogRequest} from "@app/core/services/application-log.service";
import {PaaSDeploymentLog} from "@app/core";
import * as _ from "lodash";
import {FormControl} from "@angular/forms";
import {debounceTime} from "rxjs/operators";

@Component({
  selector: 'w4c-active-deployment-logs',
  templateUrl: './active-deployment-logs.component.html',
  styleUrls: ['./active-deployment-logs.component.css']
})
export class ActiveDeploymentLogsComponent implements OnInit, OnDestroy {

  @Input()
  fsmContext: ApplicationWizardMachineContext;

  @ViewChild('logsViewer', {static: true})
  private logsViewer: ElementRef;

  // the search field for querying logs
  searchField: FormControl = new FormControl();

  // indicates if the polling is active.
  isPolling = true;

  // the data to display
  logs: PaaSDeploymentLog[];

  // the search log request can be changed on user actions
  searchLogRequest = new SearchLogRequest();

  // indicates that the autoscrolling is activated or not
  autoscrollingDisabled: boolean = false;

  // just a boolean that is used to prevent autoscroll to be considered as use action on scroll
  private scrollingToBottom: boolean = false;

  private destroyed: boolean = false;

  // this numbers are used when a user want to delete logs.
  private lastLogOffset: number = 0;
  private lastLogLength: number = 0;

  constructor(private applicationLogService: ApplicationLogService) { }

  ngOnInit() {
    this.searchLogRequest.sortConfiguration = {sortBy: "timestamp", ascending: true};
    this.searchLogRequest.from = 0;
    this.searchLogRequest.size = 10000;
    this.fetchLogs();

    this.searchField.valueChanges
      .pipe(debounceTime(1000))
      .subscribe(term => {
        this.searchLogRequest.query = term;
      });
  }

  private fetchLogs() {
    if (this.destroyed) {
      return;
    }
    this.applicationLogService.searchEnvironmentLogs(
      this.fsmContext.application.id,
      this.fsmContext.environment.id,
      this.searchLogRequest).subscribe(value => {
        console.log(`logs size: ${value.data.length} / ${value.totalResults}`);
        this.lastLogLength = value.data.length;
        this.logs = value.data;
        setTimeout(()  => this.scrollToBottom(), 10);
        setTimeout(()  => this.fetchLogs(), 1000);
      });
  }

  deleteLogs() {
    this.scrollingToBottom = true;
    this.logs = [];
    this.lastLogOffset += this.lastLogLength;
    this.searchLogRequest.from = this.lastLogOffset;
    setTimeout(()  => this.scrollingToBottom = false, 100);
  }

  ngOnDestroy(): void {
    this.destroyed = true;
  }

  private scrollToBottom(): void {
    if (this.autoscrollingDisabled) {
      return;
    }
    try {
      this.scrollingToBottom = true;
      this.logsViewer.nativeElement.scrollTop = this.logsViewer.nativeElement.scrollHeight;
      setTimeout(()  => this.scrollingToBottom = false, 100);
    } catch(err) { }
  }

  scrollChanged(event: any) {
    if (this.scrollingToBottom) {
      return;
    }
    let element = this.logsViewer.nativeElement;
    console.log(`element.scrollHeight: ${element.scrollHeight}, element.scrollTop: ${element.scrollTop}, element.clientHeight: ${element.clientHeight}`);

    let atBottom = _.inRange(element.scrollHeight - element.scrollTop, element.clientHeight - 50, element.clientHeight + 50);
    console.log("At bottom: ", atBottom);
    if (this.autoscrollingDisabled && atBottom) {
      this.autoscrollingDisabled = false
    } else {
      this.autoscrollingDisabled = true
    }
    console.log("disableScrollDown: ", this.autoscrollingDisabled);
  }

}
