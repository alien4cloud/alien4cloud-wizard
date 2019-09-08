import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output, Renderer, Renderer2,
  SimpleChanges,
  ViewChild
} from '@angular/core';
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

  @ViewChild("matFormField", {static: true, read: ElementRef}) matFormField: ElementRef;

  @Input() propertyDefinition: PropertyDefinition;

  /**
   * The id used to register to the FormGroup and to be set as DOM ID (so must not contain special chars).
   */
  @Input() id: string;

  /**
   * The label that will be displayed.
   */
  @Input() label: string;

  private rawValue: AbstractPropertyValue;

  @Input() public set value(value: AbstractPropertyValue) {
    this.rawValue = value;
    if (this.initialiazed) {
      this.initValue();
    }
  }

  /**
   * If provided, add the created FormControl to this FormGroup.
   */
  @Input() formGroup: FormGroup;

  @Output() valueChange: EventEmitter<any> = new EventEmitter<any>();

  pfd: PropertyFormDefinition;

  isLongText: boolean = false;
  
  /**
   * This boolean is used to know if the component has already been initialized.
   */
  private initialiazed = false;

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2
  ) { }

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

    this.pfd.formType = PropertyFormType.INPUT;
    switch(this.propertyDefinition.type) {
      case "integer":
      case "float": {
        this.pfd.inputType = "number";
        if (this.pfd.definition.options && this.pfd.definition.options.useSlider) {
          this.pfd.formType = PropertyFormType.SLIDER;
        }
        break;
      }
      case "boolean": {
        this.pfd.formType = PropertyFormType.CHEKBOX;
        break;
      }
      case "scalar-unit.size": {
        this.initScalarUnits(['B', 'KB', 'KIB', 'MB', 'MIB', 'GB', 'GIB', 'TB', 'TIB']);
        break;
      }
      case "scalar-unit.time": {
        this.initScalarUnits(['d', 'h', 'm', 's', 'ms', 'us', 'ns']);
        break;
      }
      case "scalar-unit.frequency": {
        this.initScalarUnits(['Hz', 'KHz', 'MHz', 'GHz']);
        break;
      }
      default: {
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
    }

    // init the value before listening to changes.
    this.initValue();

    // subscribe to FormControl changes and emit the value to observer.
    this.pfd.formControl.valueChanges.pipe(debounceTime(300)).subscribe(value => {
      console.log("Form value changes : ", JSON.stringify(value));
      if (this.pfd.units) {
        // in case of scalar units we need to suffixe with the unit
        this.valueChange.emit(value + " " + this.pfd.unit);
      } else {
        this.valueChange.emit(value);
      }
    });

    this.initialiazed = true;
  }

  private initValue() {
    console.log("initValue called, this.rawValue:", this.rawValue);
    if (this.rawValue && this.rawValue.hasOwnProperty('value')) {
      this.setDisplayableValue(this.rawValue['value']);
    } else {
      // TODO: manage functions
    }
  }

  private initScalarUnits(units: string[]) {
    this.pfd.inputType = "number";
    this.pfd.units = units;
    this.pfd.unit = this.pfd.units[0];
  }

  /**
   * Reset to default value.
   */
  resetDefault(event: any) {
    event.stopPropagation();
    if (this.pfd.definition.default) {
      this.rawValue = this.pfd.definition.default;
      this.initValue();
    }
  }

  private switchPasswordVisibility() {
    if (this.pfd.inputType == 'password') {
      this.pfd.inputType = 'text';
    } else if (this.pfd.inputType == 'text') {
      this.pfd.inputType = 'password';
    }
  }

  displayDescription(event: any): string {
    event.stopPropagation();
    return "";
  }
	
  private setDisplayableValue(value: any) {
    if (this.pfd.units) {
      let splitted = _.split(value, /\s+/);
      this.pfd.displayableValue = splitted[0];
      this.pfd.formControl.setValue(this.pfd.displayableValue);
      this.pfd.unit = splitted[1];
    } else {
      this.pfd.displayableValue = value;
      this.pfd.formControl.setValue(this.pfd.displayableValue);
    }
  }

  changeScalarUnit(unit: any) {
    // trigger change if something is in text box
    this.pfd.unit = unit;
    if (this.pfd.formControl.value) {
      // will trigger a change event on eventual observers
      this.valueChange.emit(this.pfd.formControl.value + " " + this.pfd.unit);
    }
  }

  onFocusIn() {
    // this is just to have the same behavior for all kind of inputs (the style of a focus mat-input change)
    // we need to manage this since for some "custom" inputs (like sliders, toggle slider) the focus is not managed
    this.renderer.addClass(this.matFormField.nativeElement, 'mat-focused');
  }

  onFocusOut() {
    // Cf. onFocusIn()
    this.renderer.removeClass(this.matFormField.nativeElement, 'mat-focused');
  }
}

export enum PropertyFormType {
  INPUT = "INPUT", CHEKBOX = "CHEKBOX", SELECT = "SELECT", SLIDER = 'SLIDER'
}

/**
 * A local class that stores configuration related to input.
 */
export class PropertyFormDefinition {
  /** The input name. */
  label: string;
  /** The property definition. */
  definition: PropertyDefinition;
  /** The value to display. */
  displayableValue: string;
  /** When we have a constraint of type valid_values, this is used to fill the drop box. */
  validValues: string[];
  /** Define the type of component that will be displayed to fill the property. */
  formType: PropertyFormType;
  /** The angular form control itself. */
  formControl: FormControl;
  /** input type managed by angular : https://material.angular.io/components/input/overview */
  inputType: string;
  /** when the type is scalar-unit, we have to display the units. If this is defined, it means that we are managing a scalar-unit property. */
  units: string[];
  /** the currently selected unit for a scalar-unit. */
  unit: string;
}
