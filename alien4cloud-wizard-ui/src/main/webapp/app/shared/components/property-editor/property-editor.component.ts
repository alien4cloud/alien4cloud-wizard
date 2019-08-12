import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AbstractPropertyValue, PropertyConstraintUtils, PropertyDefinition, PropertyValue} from "@app/core";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import * as _ from "lodash";
import {debounceTime} from "rxjs/operators";

/**
 * A component to edit something that is related to a PropertyDefinition.
 */
@Component({
  selector: 'w4c-property-editor',
  templateUrl: './property-editor.component.html',
  styleUrls: ['./property-editor.component.css']
})
export class PropertyEditorComponent implements OnInit {

  @Input() propertyDefinition: PropertyDefinition;

  /**
   * The id used to register to the FormGroup.
   */
  @Input() id: string;

  /**
   * The label that will be displayed.
   */
  @Input() label: string;

  @Input() value: any;

  /**
   * If provided, add the created FormControl to this FormGroup.
   */
  @Input() formGroup: FormGroup;

  @Output() valueChange: EventEmitter<any> = new EventEmitter<any>();

  private pfd: PropertyFormDefinition;

  private isLongText: boolean = false;

  constructor() { }

  ngOnInit() {
    this.pfd = new PropertyFormDefinition();
    this.pfd.label = this.label;
    this.pfd.definition = this.propertyDefinition;
    let formControl = new FormControl();
    if (this.pfd.definition.required) {
      formControl.setValidators([Validators.required]);
    }
    this.pfd.formControl = formControl;
    if (this.formGroup) {
      this.formGroup.addControl(this.id, formControl);
    }
    if (this.value && this.value.hasOwnProperty('value')) {
      this.pfd.displayableValue = this.value['value'];
      this.pfd.formControl.setValue(this.pfd.displayableValue);
    }
    this.pfd.formType = PropertyFormType.INPUT;
    if (this.propertyDefinition.type == "integer" || this.propertyDefinition.type == "float") {
      this.pfd.inputType = "number";
    } else if (this.propertyDefinition.type == "boolean") {
      this.pfd.formType = PropertyFormType.CHEKBOX;
    } else {
      this.pfd.inputType = "text";
      // manage SELECT
      let validValuesConstraint = PropertyConstraintUtils.getValidValuesConstraint(this.propertyDefinition);
      if (validValuesConstraint) {
        this.pfd.validValues = validValuesConstraint.validValues;
        this.pfd.formType = PropertyFormType.SELECT;
      }
      if (this.pfd.definition.password) {
        this.pfd.inputType = "password";
      }
    }
    // subscribe to FormControl changes and emit the value to observer.
    this.pfd.formControl.valueChanges.pipe(debounceTime(1000)).subscribe(value => {
      console.log("Form value changes : ", JSON.stringify(value));
      this.valueChange.emit(value);
    });
  }

  /**
   * Reset to default value.
   */
  resetDefault() {
    this.pfd.formControl.setValue(this.pfd.definition.default.value);
  }

  switchPasswordVisibility() {
    if (this.pfd.inputType == 'password') {
      this.pfd.inputType = 'text';
    } else if (this.pfd.inputType == 'text') {
      this.pfd.inputType = 'password';
    }
  }
}

export enum PropertyFormType {
  INPUT = "INPUT", CHEKBOX = "CHEKBOX", SELECT = "SELECT"
}

/**
 * A local class that stores configuration related to input.
 */
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
