import { MachineConfig, actions } from 'xstate';
import {
  ApplicationWizardMachineContext,
  ApplicationWizardMachineSchema
} from "@app/features/application-wizard/core/fsm.model";
import { ApplicationWizardMachineEvents } from "@app/features/application-wizard/core/fsm.events";
import { Environment } from '@app/core';

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
  environments: undefined,
  deploymentTopologyId: undefined,
  environmentId: undefined,
  locationId: undefined,
  locationName: undefined,
  orchestratorId: undefined,
  errorMessage: undefined,
  locations: undefined,
  deploymentId : undefined
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
          {
            target: 'templateSelectionForm',
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
          {
            target: 'applicationCreateForm',
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
          {
            target: 'environmentSearching',
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
          {
            target: 'applicationCreateForm'
          }
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
          target: 'applicationCreationError',
          actions: ['assignError']
        }
      }
    },
    environmentSearching: {
      invoke: {
        id: 'searchEnvironments',
        src: 'searchEnvironments'
      },
      on: {
        DO_SELECT_ENVIRONMENT: {
          target: 'environmentSelected',
          actions: ['assignEnvironmentId']
        },
        ON_ENVIRONMENTS_FETCHED: {
          target: 'environmentSelectionForm',
          actions: ['assignEnvironments']
        }
      }
    },
    environmentSelectionForm: {
      on: {
        DO_SELECT_ENVIRONMENT: {
          target: 'environmentSelected',
          actions: ['assignEnvironmentId']
          // actions: ['assignUser', 'loginSuccess']
        }
      }
    },
    environmentSelected: {   
      on: {
        '': [
          {
            target: 'deploymentTopologyFetching',
            actions: log(
              (context, event) => `environmentSelected: ${JSON.stringify(context)}`,
              'applicationWizard'
            )
          }
        ]
      }
    },
    deploymentTopologyFetching: {
      invoke: {
        id: 'fetchDeploymentTopology',
        src: 'fetchDeploymentTopology'
      },
      on: {
        ON_DEPLOYMENT_TOPOLOGY_FETCHED: {
          target: 'targetSearching',
          actions: ['assignDeploymentTopologyId']
          // actions: ['assignUser', 'loginSuccess']
        }
      }
    },
    targetSearching: {
      invoke: {
        id: 'searchLocations',
        src: 'searchLocations'
      },
      on: {
        DO_SELECT_TARGET: {
          target: 'targetSelected',
          actions: ['assignLocationId']
          //actions: ['assignLocation']
          // actions: ['assignUser', 'loginSuccess']
        },
        ON_TARGET_FETCHED: {
          target: 'targetSelectionForm',
          actions: ['assignLocation']
        }
      }
    },
    targetSelectionForm: {
      on: {
        DO_SELECT_TARGET: {
          target: 'targetSelected',
          actions: ['assignLocationId']
          // actions: ['assignUser', 'loginSuccess']
        }
      }
    },

    targetSelected: {
      on: {
        '': [
          {
            target: 'deploymentForm',
            actions: ['assignLocationPolicies']
           /*
            actions: log(
              (context, event) => `locationSelected: ${JSON.stringify(context)}`,
              'applicationWizard'
            )
            */
          }
        ]
      }

    },
    deploymentForm: {
      on: {
        DO_SUBMIT_DEPLOYMENT: {
          target: 'deploymentSubmitting',
          //actions: ['assignTargetId']
          // actions: ['assignUser', 'loginSuccess']
        }
      }
      //
    },
    deploymentSubmitting: {
      invoke: {
        id: 'deployApplication',
        src: 'deployApplication'
      },
      on: {
        ON_DEPLOYMENT_SUBMITTED: {
          target: 'activeDeploymentForm',
          //actions: ['assignLocationId']
          actions: ['assignLocation']
          // actions: ['assignUser', 'loginSuccess']
        }
      }
    },
    activeDeploymentForm: {
      on: {
        ON_ACTIVE_DEPLOYMENT_CHECK: [
          {
            target: 'applicationDeployed',
            actions: ['deploymentStatusCheck']
          }
        ]
      }
    },
    applicationDeployed: {
      type: 'final'
    }
  },
};
