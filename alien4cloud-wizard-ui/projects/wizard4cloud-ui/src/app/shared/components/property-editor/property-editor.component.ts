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
import {FormControl, FormGroup, Validators} from "@angular/forms";
import * as _ from "lodash";
import {debounceTime} from "rxjs/operators";
import {
  AbstractPropertyValue, ConfirmationDialogComponent,
  PropertyDefinition
} from "@alien4cloud/wizard4cloud-commons";
import {PropertyConstraintUtils} from "@alien4cloud/wizard4cloud-commons";
import {SuggestionService} from "@app/core/services";
import {MatDialog} from "@angular/material/dialog";
import {PropertyFormDialogComponent} from "@app/shared/components/property-form-dialog/property-form-dialog.component";
import {Suggestion, SuggestionContextData, SuggestionRequestContext} from "@app/core/models";
import {TranslateService} from "@ngx-translate/core";

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

  @Input() propertyNameFn: Function;

  @Input() propertyName: string;

  private rawValue: AbstractPropertyValue;

  @Input() public set value(value: AbstractPropertyValue) {
    console.log("Set value called with: " + JSON.stringify(value));
    this.rawValue = value;
    if (this.initialiazed) {
      this.initValue();
    }
  }

  /**
   * If provided, add the created FormControl to this FormGroup.
   */
  @Input() formGroup: FormGroup;

  @Input() propertyEditorContext: SuggestionRequestContext;

  localPropertyEditorContext: SuggestionRequestContext;

  @Output() valueChange: EventEmitter<any> = new EventEmitter<any>();

  pfd: PropertyFormDefinition;

  isLongText: boolean = false;

  /**
   * This boolean is used to know if the component has already been initialized.
   */
  private initialiazed = false;

  public suggestions: Suggestion[];

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private suggestionService: SuggestionService,
    private translateService: TranslateService,
    private dialog: MatDialog
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
      case "list": {
        this.pfd.formType = PropertyFormType.DIALOG;
        this.pfd.inputType = "text";
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

      if (this.propertyNameFn) {
        console.log("Calling propertyNameFn");
        this.propertyName = this.propertyNameFn.call(this, [this.id]);
      }
      console.log("Property name is " + this.propertyName);
      let context: SuggestionRequestContext = new SuggestionRequestContext();
      let data: SuggestionContextData = new SuggestionContextData();
      if (this.propertyEditorContext) {
        context.type = this.propertyEditorContext.type;
        data = _.merge(data, this.propertyEditorContext.data, {propertyName: this.propertyName});
        context.data = data;
      } else {
        context.data = {propertyName: this.propertyName};
      }
      console.log("context is " + JSON.stringify(context));
      this.localPropertyEditorContext = context;
    }

    // init the value before listening to changes.
    this.initValue();

    // subscribe to FormControl changes and emit the value to observer.
    this.pfd.formControl.valueChanges.pipe(debounceTime(300)).subscribe(value => {
      if (this.pfd.definition.suggestionId) {
/*        console.log("propertyEditorContext: " + JSON.stringify(this.propertyEditorContext));
        let context: SuggestionRequestContext = new SuggestionRequestContext();
        _.merge(context, this.propertyEditorContext, {data: {propertyName: this.propertyName}});*/
        console.log("Property name is " + this.propertyName);
        console.log("propertyEditorContext is " + JSON.stringify(this.propertyEditorContext));
        console.log("localPropertyEditorContext is " + JSON.stringify(this.localPropertyEditorContext));
        this.suggestionService.getMatchedSuggestionsContextual(this.pfd.definition.suggestionId, value, this.localPropertyEditorContext).subscribe(suggestions => {
          this.suggestions = suggestions;
        });
      }

      setTimeout(() => {
        if (this.pfd.definition.suggestionId
            && this.pfd.definition.suggestionPolicy == "Strict"
            && _.isUndefined(_.find(this.suggestions, suggestion => suggestion.value == value))) {
              this.pfd.formControl.setErrors({"constraint": this.translateService.instant("shared.PropertyEditor.NotAllowedValue")});
        } else {
          console.log("Form value changes : ", JSON.stringify(value));
          if (this.pfd.units) {
            // in case of scalar units we need to suffixe with the unit
            this.valueChange.emit(value + " " + this.pfd.unit);
          } else {
            this.valueChange.emit(value);
          }
        }
      }, 300);

    });

    this.initialiazed = true;
  }

  private initValue() {
    console.log("initValue called, this.rawValue:", this.rawValue);
    if (this.rawValue) {
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

  openPropertyDialog(pfd: PropertyFormDefinition) {
    const dialogRef = this.dialog.open(PropertyFormDialogComponent, {
      width: '65%',
      data: {
        propertyName: pfd.label,
        propertyValue: pfd.formControl.value,
        propertyDefinition: pfd.definition,
        propertyEditorContext: this.propertyEditorContext
      }
    });
    dialogRef.afterClosed().subscribe(propertyValue => {
      if (propertyValue) {
        console.log(`Property value changed for ${pfd.label}: ${propertyValue}`);
        pfd.formControl.setValue(propertyValue);
      }
    })
  }

}

export enum PropertyFormType {
  INPUT = "INPUT", CHEKBOX = "CHEKBOX", SELECT = "SELECT", SLIDER = 'SLIDER', DIALOG = "DIALOG"
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
