import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {
  PropertyFormDefinition,
  UpdatePropertyRequest,
  TemplatePropertiesEditorWrapper,
  SuggestionRequestContext
} from "@app/core/models";
import {Observable} from "rxjs";
import {AbstractPropertyValue, PropertyDefinition} from "@alien4cloud/wizard4cloud-commons";
import {FormGroup} from "@angular/forms";
import * as _ from "lodash";

@Component({
  selector: 'w4c-template-properties-editor',
  templateUrl: './template-properties-editor.component.html',
  styleUrls: ['./template-properties-editor.component.css']
})
export class TemplatePropertiesEditorComponent implements OnInit {

  public propertieFormDefitions: PropertyFormDefinition[] = new Array<PropertyFormDefinition>();

  /** The form. */
  inputsForm = new FormGroup({});

  constructor() { }

  @Input() wrapper$: Observable<TemplatePropertiesEditorWrapper>;

  @Input() propertyEditorContext: SuggestionRequestContext;

  @Output() propertyValueChange: EventEmitter<UpdatePropertyRequest> = new EventEmitter<UpdatePropertyRequest>();

  ngOnInit() {
    this.wrapper$.subscribe(value => {
      this.propertieFormDefitions = new Array<PropertyFormDefinition>();
      for (const [i, e] of Object.entries(value.definitions.properties)) {
        let pfd = new PropertyFormDefinition();
        pfd.inputName = e.key;
        pfd.definition = e.value;
        console.log("Input name is : " + pfd.inputName);
        let property_value = <AbstractPropertyValue>(value.properties.properties[i].value);
        console.log(`Input ${e.key} has value: ${ JSON.stringify(property_value) }`);
        pfd.value = property_value;
        this.propertieFormDefitions.push(pfd);
      };
      // we need to wait for rendering
      setTimeout(() => { this.initDefaults(); }, 500);
    });
  }

  initDefaults(): void {
    // if default values exist and no value is already set, fill the form with the default.
    // this will update the deployment setup by calling the backend.
    this.propertieFormDefitions.forEach(pfd => {
      if (!pfd.value && pfd.definition.default) {
        pfd.value = pfd.definition.default;
      }
    });
  }

  inputValueChanged(inputName: string, value: any) {
    console.log(`Form value changed for ${inputName}, value is :`, JSON.stringify(value));
    //let pfd =_.find(this.propertieFormDefitions, pfd => { return pfd.inputName === inputName });
    this.propertyValueChange.emit({propertyName: inputName, propertyValue: value});
  }

}
