import { Injectable } from '@angular/core';

export interface Item {
  name: string;
  value: number;
  abs: number;
}

@Injectable({
  providedIn: 'root'
})
export class DeploymentStatusPiechartDataService {
  constructor() { }
  
  getDeploymentStatusColors():Map<string,string> {
     let map: Map<string,string> = new Map() ;

     map.set("DEPLOYED", '#468847');
     map.set("UNDEPLOYED", '#999999');
     map.set("UPDATED", '#468847');
     map.set("DEPLOYMENT_IN_PROGRESS",'#428bca');
     map.set("INIT_DEPLOYMENT",'#428bca');
     map.set("UNDEPLOYMENT_IN_PROGRESS",'#428bca');
     map.set("UNKNOWN",'#000000');
     map.set("FAILURE",'#C51919');
     map.set("UPDATE_FAILURE",'#c09853');
     map.set("WARNING",'#c09853');    
     return map ;   
  }
}
