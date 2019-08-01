import { Component, OnInit, Input } from '@angular/core';
import { WizardFormComponent } from '../../core/wizard.model';
import { ApplicationWizardMachineContext } from '../../core/fsm.model';
import { AppplicationWizardMachineService } from '../../core/fsm.service';
import { timer } from 'rxjs'

@Component({
  selector: 'w4c-active-deployment',
  templateUrl: './active-deployment.component.html',
  styleUrls: ['./active-deployment.component.css']
})
export class ActiveDeploymentComponent implements OnInit,WizardFormComponent {

    // indicates data loading
    @Input() fsmContext: ApplicationWizardMachineContext;
    private isDeploying: boolean = true;

  constructor(private fsm: AppplicationWizardMachineService) { }

  ngOnInit() {
    timer(0, 500).subscribe(() => console.log('polling ...  ... ...'))
  }
}
