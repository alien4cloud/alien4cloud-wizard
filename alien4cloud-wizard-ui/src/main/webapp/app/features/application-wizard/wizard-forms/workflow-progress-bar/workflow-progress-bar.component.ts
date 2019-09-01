import {Component, Input, OnInit} from '@angular/core';
import {ApplicationWizardMachineContext} from "@app/features/application-wizard/core/fsm.model";

@Component({
  selector: 'w4c-workflow-progress-bar',
  templateUrl: './workflow-progress-bar.component.html',
  styleUrls: ['./workflow-progress-bar.component.css']
})
export class WorkflowProgressBarComponent implements OnInit {

  @Input()
  fsmContext: ApplicationWizardMachineContext;

  constructor() { }

  ngOnInit() {
  }

}
