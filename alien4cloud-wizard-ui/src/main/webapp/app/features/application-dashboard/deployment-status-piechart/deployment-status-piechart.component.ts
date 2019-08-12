import { Component, OnInit, ViewEncapsulation, AfterViewInit, ViewChild, Input } from '@angular/core';
import { Item, DeploymentStatusPiechartDataService } from '@app/core/services/deployment-status-piechart-data.service'
import { ApplicationEnvironmentDTO } from '@app/core';

@Component({
  selector: 'w4c-deployment-status-piechart',
  templateUrl: './deployment-status-piechart.component.html',
  styleUrls: ['./deployment-status-piechart.component.css']
})
export class DeploymentStatusPiechartComponent implements OnInit {

  private map: Map<string, string>;
  // Data
  @Input("applicationEnvironmentDTO") applicationEnvironmentDTO: ApplicationEnvironmentDTO[];

  view: any[] = [70, 70];

  // options
  gradient = false;
  showLegend = true;
  showYAxisLabel = true;
  colorScheme = {
    domain: []
  };
  environments: Array<any> = [];
  constructor(private deploymentStatusPiechartDataService: DeploymentStatusPiechartDataService) {
    Object.assign(this, this.environments)   
  }

  

  ngOnInit() {
    this.applicationEnvironmentDTO.map(item => {
      this.environments.push({ "name": item.name+" \n "+item.status, "value": 1})
      this.getStatusColor(item.status)
    });
  }

 
  // get status color
  getStatusColor(status: string){
    this.map = this.deploymentStatusPiechartDataService.getDeploymentStatusColors(); 
    this.map.forEach((value: string, key: string) => {
      console.log("In the first map");
      console.log(key, value);
      if (status == key) {
        this.colorScheme.domain.push(value) ;
        console.log("The status "+key+" has color "+value)
      } else {
        console.log("The status "+key+"  dosn't exists in this application environment")
      }
    });
  }
}
