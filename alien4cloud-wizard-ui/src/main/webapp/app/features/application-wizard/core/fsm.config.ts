import { MachineConfig, actions } from 'xstate';
import {
  ApplicationWizardMachineContext,
  ApplicationWizardMachineSchema
} from "@app/features/application-wizard/core/fsm.model";
import {ApplicationWizardMachineEvents} from "@app/features/application-wizard/core/fsm.events";

const { log } = actions;

/**
 * The initial machine context.
 */
export const context: ApplicationWizardMachineContext = {
  templateId: undefined,
  templateDescription: undefined,
  applicationName: undefined,
  applicationDescription: undefined,
  applicationId: undefined,
  errors: []
};

/**
 * The machine configuration : define steps and transitions.
 */
export const applicationWizardMachineConfig: MachineConfig<
  ApplicationWizardMachineContext,
  ApplicationWizardMachineSchema,
  ApplicationWizardMachineEvents
  > = {
  id: 'applicationWizard',
  strict: true,
  context,
  initial: 'boot',
  states: {
    boot: {
      on: {
        'INIT': [
          { target: 'templateSelectionForm',
            actions: log(
              (context, event) => `boot: ${JSON.stringify(context)}`,
              'applicationWizard'
            )
          }
        ]
      }
    },
    templateSelectionForm: {
      on: {
        DO_SELECT_TEMPLATE: [
          {
            target: 'templateSelected',
            actions: ['assignTemplate']
          }
        ]
      }
    },
    templateSelected: {
      on: {
        '': [
          { target: 'applicationCreateForm',
            actions: log(
              (context, event) => `templateSelected: ${JSON.stringify(context)}`,
              'applicationWizard'
            )
          }
        ]
      }
    },
    applicationCreateForm: {
      on: {
        DO_CREATE_APPLICATION: {
          target: 'applicationCreating',
          actions: ['assignAppInfo']
          // actions: ['assignUser', 'loginSuccess']
        },
        GO_BACK: {
          target: 'templateSelectionForm'
        }
      }
    },
    applicationCreated: {
      // type: 'final'
      on: {
        '': [
          { target: 'targetSelectionForm',
            actions: log(
              (context, event) => `applicationCreated: ${JSON.stringify(context)}`,
              'applicationWizard'
            )
          }
        ]
      }
    },
    applicationCreationError: {
      on: {
        '': [
          { target: 'applicationCreateForm' }
        ]
      }
    },
    applicationCreating: {
      invoke: {
        id: 'createApplication',
        src: 'createApplication'
      },
      on: {
        ON_APPLICATION_CREATE_SUCCESS: {
          target: 'applicationCreated',
          actions: ['assignAppId']
          // actions: ['assignUser', 'loginSuccess']
        },
        ON_APPLICATION_CREATE_ERROR: {
          target: 'applicationCreationError'
          // actions: ['assignErrors']
        }
      }
    },
    targetSelectionForm: {
      type: 'final'
    },
  }
};
