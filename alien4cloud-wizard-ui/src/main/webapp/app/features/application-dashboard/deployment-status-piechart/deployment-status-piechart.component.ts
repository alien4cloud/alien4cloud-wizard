import { Component, OnInit, Input } from '@angular/core';
import { ApplicationEnvironmentDTO } from '@app/core';

@Component({
  selector: 'w4c-deployment-status-piechart',
  templateUrl: './deployment-status-piechart.component.html',
  styleUrls: ['./deployment-status-piechart.component.css']
})
export class DeploymentStatusPiechartComponent implements OnInit {

  private colorsByStatus: Map<string, string>;
  // Data
  @Input("applicationEnvironmentDTO") applicationEnvironmentDTO: ApplicationEnvironmentDTO[];

  view: any[] = [70, 70];

  // options
  gradient = false;
  colorScheme = {domain: [] };
  environments: Array<any> = [];

  constructor() {
    // FIXME : we should be able to use our CSS instead
    this.colorsByStatus = new Map<string, string>();
    this.colorsByStatus.set("DEPLOYED", '#468847');
    this.colorsByStatus.set("UNDEPLOYED", '#999999');
    this.colorsByStatus.set("UPDATED", '#468847');
    this.colorsByStatus.set("DEPLOYMENT_IN_PROGRESS",'#428bca');
    this.colorsByStatus.set("INIT_DEPLOYMENT",'#428bca');
    this.colorsByStatus.set("UNDEPLOYMENT_IN_PROGRESS",'#428bca');
    this.colorsByStatus.set("UNKNOWN",'#000000');
    this.colorsByStatus.set("FAILURE",'#C51919');
    this.colorsByStatus.set("UPDATE_FAILURE",'#c09853');
    this.colorsByStatus.set("WARNING",'#c09853');
  }

  ngOnInit() {
    this.applicationEnvironmentDTO.map(item => {
      this.environments.push({ "name": item.name+" \n "+item.status, "value": 1})
      this.colorScheme.domain.push(this.colorsByStatus.get(item.status));
    });
  }

}
