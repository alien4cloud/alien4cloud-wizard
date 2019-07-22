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
} from "@app/features/application-wizard/fsm/application-wizard-machine.schema";
import {
  ApplicationWizardMachineEvents, DoCreateApplication, DoSelectTemplate, OnApplicationCreateError,
  OnApplicationCreateSucess
} from "@app/features/application-wizard/fsm/application-wizard-machine.events";
import {applicationWizardMachineConfig} from "@app/features/application-wizard/fsm/application-wizard-machine.config";


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
        templateId: event.templateId
      })),
      assignAppInfo: assign<ApplicationWizardMachineContext, DoCreateApplication>((_, event) => ({
        applicationName: event.name, applicationDescription: event.description
      })),
      assignAppId: assign<ApplicationWizardMachineContext, OnApplicationCreateSucess>((_, event) => ({
        applicationId: event.applicationId
      }))
      // ,
      // assignErrors: assign<AuthContext, LoginFail>((_, event) => ({
      //   errors: Object.keys(event.errors || {}).map(
      //     key => `${key} ${event.errors[key]}`
      //   )
      // })),
      // loginSuccess: (ctx, _) => {
      //   localStorage.setItem('jwtToken', ctx.user.token);
      //   this.router.navigateByUrl('');
      // }
    }
  };

  private _applicationWizardMachine = Machine<ApplicationWizardMachineContext, ApplicationWizardMachineSchema, ApplicationWizardMachineEvents>(
    applicationWizardMachineConfig
  ).withConfig(this.machineOptions);
  private service = interpret(this._applicationWizardMachine, { devTools: true }).start();

  applicationWizardState$ = fromEventPattern<[State<ApplicationWizardMachineContext, ApplicationWizardMachineEvents>, EventObject]>(
    handler => {
      return this.service.onTransition(handler);
    },
    (_, service) => service.stop()
  ).pipe(map(([state, _]) => state));

  send(event: ApplicationWizardMachineEvents) {
    this.service.send(event);
  }

  constructor(private topologyTemplateService: TopologyTemplateService, private router: Router) {}
}
