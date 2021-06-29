import {Component, Inject, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {PropertyDefinition, SettingsService} from "@alien4cloud/wizard4cloud-commons";
import {RedirectionTask, TaskCode, TopologyValidationResult} from "@app/core/models";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {DOCUMENT} from "@angular/common";

@Component({
  selector: 'w4c-deployment-validation-tasks',
  templateUrl: './deployment-validation.component.html',
  styleUrls: ['./deployment-validation.component.css'],
  animations : [
    // this animation will operate when adding or removing an item in the cart
    trigger('fade', [
      state('in', style({opacity: 1, height: '*'})),
      transition(':enter', [
        style({opacity: 0, height: '0px'}),
        animate(300 )
      ]),
      transition(':leave',
        animate(300, style({opacity: 0, height: '0px'})))
    ]),
  ],
})
export class DeploymentValidationComponent implements OnInit, OnChanges {

  @Input() topologyValidationResult: TopologyValidationResult;

  @Input() applicationId: string;
  @Input() environmentId: string;

  displayDetails: boolean = false;

  constructor(
    private settingsService: SettingsService,
    @Inject(DOCUMENT) private document: Document
  ) { }

  ngOnInit() {
    const redirectInNewTab = this.settingsService.getSetting(SettingsService.REDIRECT_IN_NEW_TAB) == 'true';
    console.log("taskList: ", this.topologyValidationResult.taskList);
    if (this.topologyValidationResult.taskList) {
      this.topologyValidationResult.taskList.filter(value => {
        if (value.code == TaskCode.REDIRECTION_REQUIRED) {
          console.log("Redirection detected: ", value);
          console.log("Current url: ", window.location.href);
          const task = <RedirectionTask>value;
          let url = task.url;
          if (task.backUrlParam) {
            let regexp = /(.*)(new-wizard|app-wizard).*/g;
            let groups = regexp.exec(window.location.href);
            // We need to build a back URL regarding curent URL
            // If we are in a new wizard, we will route to the app wizard (as if we were passed by dashboard)
            let backUrl = groups[1] + "app-wizard/" + this.applicationId + "/" + this.environmentId;
            console.log("back url: ", backUrl);
            if (url.indexOf("?") > -1 ) {
              // URL has already params
              url = url + "&" + task.backUrlParam + "=" + encodeURIComponent(backUrl);
            } else {
              // URL don't have params
              url = url + "?" + task.backUrlParam + "=" + encodeURIComponent(backUrl);
            }
          }
          if (redirectInNewTab) {
            window.open(url, "_blank");
          } else {
            this.document.location.href = url;
          }
        }
      })
    }
  }

  onSwitch(){
    this.displayDetails = !this.displayDetails;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.displayDetails = (this.topologyValidationResult.taskList && this.topologyValidationResult.taskList.length > 0);
  }

  public isNotEmpty(): boolean {
    return (this.topologyValidationResult.taskList && this.topologyValidationResult.taskList.length > 0)
      || (this.topologyValidationResult.infoList && this.topologyValidationResult.infoList.length > 0)
      || (this.topologyValidationResult.warningList && this.topologyValidationResult.warningList.length > 0)
  }

}
