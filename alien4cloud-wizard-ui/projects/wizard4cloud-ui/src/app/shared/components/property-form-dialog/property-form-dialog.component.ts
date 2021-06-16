import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {PropertyDefinition} from "@alien4cloud/wizard4cloud-commons";
import {SuggestionRequestContext} from "@app/core/models";

export interface PropertyFormDialogData {
  propertyName: string;
  propertyValue: any;
  propertyDefinition: PropertyDefinition;
  propertyEditorContext: SuggestionRequestContext;
}

@Component({
  selector: 'w4c-property-form-dialog',
  templateUrl: './property-form-dialog.component.html',
  styleUrls: ['./property-form-dialog.component.css']
})
export class PropertyFormDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<PropertyFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PropertyFormDialogData
  ) { }

  ngOnInit() {
    console.log("data is: ", this.data);
  }

  valueChanged($event: any) {
    this.data.propertyValue = $event;
  }

}
