import { Type } from '@angular/core';

export class WizardFormStep {
  constructor(
    public index: number,
    public stepLabel: string,
    public component: Type<any>,
    public fsmStateName: string,
    public completed: boolean,
    public editable: boolean
  ) {}
}
