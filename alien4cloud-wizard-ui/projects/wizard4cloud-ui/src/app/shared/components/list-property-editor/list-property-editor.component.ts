import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {PropertyDefinition} from "@alien4cloud/wizard4cloud-commons";
import {PropertyFormDefinition, SuggestionRequestContext, UpdatePropertyRequest} from "@app/core/models";
import {FormControl, FormGroup} from "@angular/forms";
import * as _ from "lodash";

@Component({
  selector: 'w4c-list-property-editor',
  templateUrl: './list-property-editor.component.html',
  styleUrls: ['./list-property-editor.component.css']
})
export class ListPropertyEditorComponent implements OnInit {

  @Input() propertyDefinition: PropertyDefinition;

  @Input() initialValue: any;

  @Input() propertyEditorContext: SuggestionRequestContext;

  @Output() valueChange: EventEmitter<any> = new EventEmitter<any>();

  @Input() propertyName: string;

  public propertieFormDefitions: PropertyFormDefinition[] = new Array<PropertyFormDefinition>();

  private entryIndex = 0;

  constructor() { }

  ngOnInit() {
    if (this.initialValue) {
      var valueArr = <Array<any>>this.initialValue;
      valueArr.forEach(value => {
        this.addEntry(value);
      });
    }
  }

  addEntry(value?: any) {
    let pfd = new PropertyFormDefinition();
    pfd.inputName = "#" + this.entryIndex++;
    pfd.definition = this.propertyDefinition;
    if (value) {
      let apv: any = {value: value};
      pfd.value = apv;
      pfd.editedValue = value;
    }
    this.propertieFormDefitions.push(pfd);
  }

  inputValueChanged(inputName: string, value: any) {
    console.log(`Form value changed for ${inputName}, value is :`, JSON.stringify(value));
    let pfd = _.find(this.propertieFormDefitions, pfd => { return pfd.inputName === inputName });
    //let apv: any = {value: value};
    pfd.editedValue = value;
    this.fireValueChanged();
  }

  private fireValueChanged() {
    let listValue : any[] = [];
    this.propertieFormDefitions.forEach(pfd => { listValue.push(pfd.editedValue) });
    console.log("List values : " + JSON.stringify(listValue));
    this.valueChange.emit(listValue)
  }

  deleteEntry(pfd: PropertyFormDefinition) {
    setTimeout(() => {
      _.remove(this.propertieFormDefitions, pfdi => pfd === pfdi);
      this.fireValueChanged();
    });
  }

  upEntry(pfd: PropertyFormDefinition) {
    setTimeout(() => {
      this.moveEntry(pfd, -1);
    });
  }

  downEntry(pfd: PropertyFormDefinition) {
    setTimeout(() => {
      this.moveEntry(pfd, +1);
    });
  }

  getPropertyName(inputId: string) {
    console.log("Looking for property index of " + inputId);
    let i = _.findIndex(this.propertieFormDefitions, pfdi => pfdi.inputName == inputId);
    console.log("Property index of " + inputId + " is " + i);
    return this.propertyName + "[" + i + "]";
  }

  private moveEntry(pfd: PropertyFormDefinition, sign: number) {
    console.log(`Moving ${pfd.inputName} of ${sign}`);
    let i = _.findIndex(this.propertieFormDefitions, pfdi => pfdi === pfd);
    let removed = _.remove(this.propertieFormDefitions, pfdi => pfdi === pfd);
    this.propertieFormDefitions.splice(i + sign, 0, removed[0]);
    this.fireValueChanged();
  }



}
