import { Component, OnInit,Input } from '@angular/core';
import { Application } from "../../shared/a4c-payloads/application.model";
import { Metaproperty } from '../../shared/a4c-payloads/metaproperty.model';

@Component({
  selector: 'app-application-details',
  templateUrl: './application-details.component.html',
  styleUrls: ['./application-details.component.css']
})
export class ApplicationDetailsComponent implements OnInit {

  @Input("appli") appli : Application[];
  @Input("metas") metas : Metaproperty[];


  details : Application ;



  constructor() { }

  ngOnInit() {
    this.details = this.appli[0] ;
    console.log("message from parent :----->"+this.appli[0].id)
  }

}
