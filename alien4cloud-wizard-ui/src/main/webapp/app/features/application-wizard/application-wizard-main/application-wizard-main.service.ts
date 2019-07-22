import {Injectable} from '@angular/core';
import {WizardFormStep} from "@app/features/application-wizard/application-wizard-main/application-wizard-main.model";
import {WelcomeComponent} from "@app/features/application-wizard/step-forms/welcome/welcome.component";
import {TemplateSelectionComponent} from "@app/features/application-wizard/step-forms/template-selection/template-selection.component";
import {ApplicationCreateComponent} from "@app/features/application-wizard/step-forms/application-create/application-create.component";
import {TargetSelectionComponent} from "@app/features/application-wizard/step-forms/target-selection/target-selection.component";


@Injectable({
  providedIn: 'root'
})
export class ApplicationWizardMainService {

  constructor() {
  }

  getSteps() {
    return [
      new WizardFormStep(0, "Welcome", WelcomeComponent, ""),
      new WizardFormStep(1, "Pick a template", TemplateSelectionComponent, "templateSelectionForm"),
      new WizardFormStep(2, "Fill the app form", ApplicationCreateComponent, "applicationCreateForm"),
      new WizardFormStep(3, "Select Target", TargetSelectionComponent, "targetSelectionForm")
    ];
  }

}
