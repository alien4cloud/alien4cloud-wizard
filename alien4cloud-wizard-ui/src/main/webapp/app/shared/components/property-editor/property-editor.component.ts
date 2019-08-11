import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AbstractPropertyValue, PropertyConstraintUtils, PropertyDefinition, PropertyValue} from "@app/core";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import * as _ from "lodash";
import {debounceTime} from "rxjs/operators";

@Component({
  selector: 'w4c-property-editor',
  templateUrl: './property-editor.component.html',
  styleUrls: ['./property-editor.component.css']
})
export class PropertyEditorComponent implements OnInit {

  @Input() propertyDefinition: PropertyDefinition;

  @Input() id: string;

  @Input() label: string;

  @Input() value: any;

  @Input() formGroup: FormGroup;

  @Output() valueChange: EventEmitter<any> = new EventEmitter<any>();

  private pfd: PropertyFormDefinition;

  constructor() { }

  ngOnInit() {
    let pd = this.propertyDefinition;
    this.pfd = new PropertyFormDefinition();
    this.pfd.label = this.label;
    this.pfd.definition = this.propertyDefinition;
    let formControl = new FormControl(this.value);
    if (this.pfd.definition.required) {
      formControl.setValidators([Validators.required]);
    }
    this.pfd.formControl = formControl;
    this.formGroup.addControl(this.id, formControl);

    this.pfd.formType = PropertyFormType.INPUT;
    if (pd.type == "integer" || pd.type == "float") {
      this.pfd.inputType = "number";
    } else if (pd.type == "boolean") {
      this.pfd.formType = PropertyFormType.CHEKBOX;
    } else {
      this.pfd.inputType = "text";
      // manage SELECT
      let validValuesConstraint = PropertyConstraintUtils.getValidValuesConstraint(pd);
      if (validValuesConstraint) {
        this.pfd.validValues = validValuesConstraint.validValues;
        this.pfd.formType = PropertyFormType.SELECT;
      }
    }
    this.pfd.formControl.valueChanges.pipe(debounceTime(1000)).subscribe(value => {
      console.log("Form value changes : ", JSON.stringify(value));
      this.valueChange.emit(value);
    });
  }

}

export enum PropertyFormType {
  INPUT = "INPUT", CHEKBOX = "CHEKBOX", SELECT = "SELECT"
}

export class PropertyFormDefinition {
  /** The input name. */
  label: string;
  /** The property definition. */
  definition: PropertyDefinition;
  /** The raw value. */
  value: AbstractPropertyValue;
  /** The value to display. */
  displayableValue: string;
  /** When we have a constraint of type valid_values, this is used to fill the drop box. */
  validValues: string[];
  /** Define the type of component that will be displayed to fill the property. */
  formType: PropertyFormType;
  /** The angular form control itself. */
  formControl: FormControl;
  // input type managed by angular : https://material.angular.io/components/input/overview
  inputType: string;
}
