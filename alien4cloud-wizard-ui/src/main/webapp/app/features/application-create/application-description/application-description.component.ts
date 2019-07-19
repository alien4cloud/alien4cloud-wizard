import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-application-description',
  templateUrl: './application-description.component.html',
  styleUrls: ['./application-description.component.css']
})
export class ApplicationDescriptionComponent implements OnInit {

  @Input('selectedTopoDescription') selectedTopoDescription: string;
  @Input('selectedTopoArchiveName') selectedTopoArchiveName: string;

  displayArchiveName :string ;
  displayDescription :string ;

  constructor() { }

  
  ngOnInit() {}
  
  ngOnChanges() {
    this.displayArchiveName = this.selectedTopoArchiveName;
    this.displayDescription = this.selectedTopoDescription;
  }

  ngAfterViewInit(){}
}
