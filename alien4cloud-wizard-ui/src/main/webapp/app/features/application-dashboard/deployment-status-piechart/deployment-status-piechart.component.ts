import { Component, OnInit, Input } from '@angular/core';
import { ApplicationEnvironmentDTO } from '@app/core';

@Component({
  selector: 'w4c-deployment-status-piechart',
  templateUrl: './deployment-status-piechart.component.html',
  styleUrls: ['./deployment-status-piechart.component.css']
})
export class DeploymentStatusPiechartComponent implements OnInit {

  private map: Map<string, string> = new Map();
  // Data
  @Input("applicationEnvironmentDTO") applicationEnvironmentDTO: ApplicationEnvironmentDTO[];

  view: any[] = [70, 70];

  // options
  gradient = false;
  showLegend = true;
  showYAxisLabel = true;
  colorScheme = {domain: [] };
  environments: Array<any> = [];

  constructor() {}

  ngOnInit() {
    //Map color initialization
    this.getDeploymentStatusColors() 

    this.applicationEnvironmentDTO.map(item => {
      this.environments.push({ "name": item.name+" \n "+item.status, "value": 1})
      this.colorScheme.domain.push(this.map.get(item.status));
    });
  }

  getDeploymentStatusColors() {
    this.map.set("DEPLOYED", '#468847');
    this.map.set("UNDEPLOYED", '#999999');
    this.map.set("UPDATED", '#468847');
    this.map.set("DEPLOYMENT_IN_PROGRESS",'#428bca');
    this.map.set("INIT_DEPLOYMENT",'#428bca');
    this.map.set("UNDEPLOYMENT_IN_PROGRESS",'#428bca');
    this.map.set("UNKNOWN",'#000000');
    this.map.set("FAILURE",'#C51919');
    this.map.set("UPDATE_FAILURE",'#c09853');
    this.map.set("WARNING",'#c09853');    
 }
}
