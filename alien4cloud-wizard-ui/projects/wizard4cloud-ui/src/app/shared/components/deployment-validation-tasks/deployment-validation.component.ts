import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {PropertyDefinition} from "@alien4cloud/wizard4cloud-commons";
import {TopologyValidationResult} from "@app/core/models";
import {animate, state, style, transition, trigger} from "@angular/animations";

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

  displayDetails: boolean = false;

  constructor() { }

  ngOnInit() {
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
