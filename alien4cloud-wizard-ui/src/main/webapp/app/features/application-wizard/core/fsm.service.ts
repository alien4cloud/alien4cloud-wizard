import { fromEventPattern, of } from 'rxjs';
import {
  interpret,
  Machine,
  MachineOptions,
  State,
  assign,
  EventObject
} from 'xstate';
import { Injectable } from '@angular/core';
import { map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

import {TopologyTemplateService} from "@app/core";
import {
  ApplicationWizardMachineContext,
  ApplicationWizardMachineSchema
} from "@app/features/application-wizard/core/fsm.model";
import {
  ApplicationWizardMachineEvents, DoCreateApplication, DoSelectTemplate, OnApplicationCreateError,
  OnApplicationCreateSucess
} from "@app/features/application-wizard/core/fsm.events";
import {applicationWizardMachineConfig} from "@app/features/application-wizard/core/fsm.config";

/**
 * Manages the machine initialization.
 */
@Injectable()
export class AppplicationWizardMachineService {
  machineOptions: Partial<MachineOptions<ApplicationWizardMachineContext, ApplicationWizardMachineEvents>> = {
    services: {
      createApplication: (_, event) =>
        this.topologyTemplateService
          .createApplication({
            name: _.applicationName,
            archiveName: _.applicationName,
            topologyTemplateVersionId: _.templateId,
            description: _.applicationDescription
          })
          .pipe(
            map(data => new OnApplicationCreateSucess(data['data'])),
            catchError(result => of(new OnApplicationCreateError({})))
          )
    },
    guards: {
      // isLoggedOut: () => !localStorage.getItem('jwtToken')
    },
    actions: {
      assignTemplate: assign<ApplicationWizardMachineContext, DoSelectTemplate>((_, event) => ({
        templateId: event.templateId, templateDescription: event.templateDescription
      })),
      assignAppInfo: assign<ApplicationWizardMachineContext, DoCreateApplication>((_, event) => ({
        applicationName: event.name, applicationDescription: event.description
      })),
      assignAppId: assign<ApplicationWizardMachineContext, OnApplicationCreateSucess>((_, event) => ({
        applicationId: event.applicationId
      }))
    }
  };

  private _applicationWizardMachine = Machine<ApplicationWizardMachineContext, ApplicationWizardMachineSchema, ApplicationWizardMachineEvents>(
    applicationWizardMachineConfig
  ).withConfig(this.machineOptions);
  private service = interpret(this._applicationWizardMachine, { devTools: true }).start();

  /**
   * This subject will broadcast state changed events (AKA transition).
   */
  applicationWizardState$ = fromEventPattern<[State<ApplicationWizardMachineContext, ApplicationWizardMachineEvents>, EventObject]>(
    handler => {
      return this.service.onTransition(handler);
    },
    (_, service) => service.stop()
  ).pipe(map(([state, _]) => state));

  constructor(
    private topologyTemplateService: TopologyTemplateService,
    private router: Router
  ) {}

  /**
   * Send an event to the machine in order to trigger a transition.
   * @param event
   */
  send(event: ApplicationWizardMachineEvents) {
    this.service.send(event);
  }

}
