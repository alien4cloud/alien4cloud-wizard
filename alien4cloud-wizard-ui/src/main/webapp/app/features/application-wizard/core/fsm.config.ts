import { MachineConfig, actions } from 'xstate';
import {
  ApplicationWizardMachineContext,
  ApplicationWizardMachineSchema
} from "@app/features/application-wizard/core/fsm.model";
import { ApplicationWizardMachineEvents } from "@app/features/application-wizard/core/fsm.events";

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
          actions: ['assignAppId', 'clearError']
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
          target: 'locationSearching',
          actions: ['assignDeploymentTopologyId']
          // actions: ['assignUser', 'loginSuccess']
        }
      }
    },
    locationSearching: {
      invoke: {
        id: 'searchLocations',
        src: 'searchLocations'
      },
      on: {
        DO_SELECT_LOCATION: {
          target: 'locationSelected',
          actions: ['assignLocationId']
          //actions: ['assignLocation']
          // actions: ['assignUser', 'loginSuccess']
        },
        ON_TARGET_FETCHED: {
          target: 'locationSelectionForm',
          actions: ['assignLocation']
        }
      }
    },
    locationSelectionForm: {
      on: {
        DO_SELECT_LOCATION: {
          target: 'locationSelected',
          actions: ['assignLocationId']
          // actions: ['assignUser', 'loginSuccess']
        }
      }
    },

    locationSelected: {
      invoke: {
        id: 'setLocationPolicies',
        src: 'setLocationPolicies'
      },
      on: {
        'ON_SELECT_TARGET_SUCESSS': [
          {
            target: 'deploymentForm'
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
        id: 'deploy',
        src: 'deploy'
      },
      on: {
        ON_DEPLOYMENT_SUBMIT_SUCCESS: {
          target: 'activeDeploymentForm'
        },
        ON_DEPLOYMENT_SUBMIT_ERROR: {
          target: 'deploymentForm',
          actions: ['assignError']
        }
      }
    },
    activeDeploymentForm: {
      on: {
        ON_ACTIVE_DEPLOYMENT_CHECK: [
          {
            target: 'applicationDeployed'
            // ,actions: ['deploymentStatusCheck']
          }
        ]
      }
    },
    applicationDeployed: {
      type: 'final'
    }
  },
};
