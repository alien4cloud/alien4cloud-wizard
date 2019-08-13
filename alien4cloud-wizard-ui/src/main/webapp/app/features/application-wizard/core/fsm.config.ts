import { MachineConfig, actions } from 'xstate';
import {
  ApplicationWizardMachineContext,
  ApplicationWizardMachineSchema
} from "@app/features/application-wizard/core/fsm.model";
import {
  ApplicationWizardMachineEvents
} from "@app/features/application-wizard/core/fsm.events";

const { log } = actions;

/**
 * The initial machine context.
 */
export const context: ApplicationWizardMachineContext = {
  topologyTemplate: undefined,
  applicationMetapropertiesConfiguration: undefined,
  applicationName: undefined,
  applicationDescription: undefined,
  applicationArchiveName: undefined,
  applicationId: undefined,
  environments: undefined,
  deploymentTopology: undefined,
  environmentId: undefined,
  locationId: undefined,
  locationName: undefined,
  orchestratorId: undefined,
  errorMessage: undefined,
  locations: undefined,
  deploymentId: undefined,
  deploymentStatus: undefined
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
        ],
        'INIT_APPLICATION_ENVIRONMENT': [
          {
            target: 'applicationEnvironmentInitializing',
            actions: ['assignAppInitInfo']
          }

        ]
      }
    },
    applicationEnvironmentInitializing: {
      invoke: {
        id: 'getActiveDeployment',
        src: 'getActiveDeployment'
      },
      on: {
        ON_ACTIVE_DEPLOYMENT_FOUND: {
          target: 'activeDeploymentForm',
          actions: ['assignDeployment']
        },
        DO_SELECT_ENVIRONMENT: {
          target: 'environmentSelected'
        }
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
          target: 'templateSelectionForm',
          cond: 'backToTemplateSelectionIsPossible'
        }
      }
    },
    applicationMetapropertiesSearching: {
      invoke: {
        id: 'searchApplicationMetaproperties',
        src: 'searchApplicationMetaproperties'
      },
      on: {
        OnApplicationMetapropertiesFound: [
          {
            target: 'applicationMetapropertiesForm'
          }
        ],
        OnApplicationMetapropertiesNotFound: [
          {
            target: 'environmentSearching'
          }
        ],
      }
    },
    applicationMetapropertiesForm: {
      on: {
        OnFormCompleted: {
          target: 'environmentSearching'
        }
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
          target: 'applicationMetapropertiesSearching',
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
            target: 'deploymentTopologyFetching'
            // ,actions: log(
            //   (context, event) => `environmentSelected: ${JSON.stringify(context)}`,
            //   'applicationWizard'
            // )
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
        // if the deployment topology has inputs, then branch to InputForm
        ON_DEPLOYMENT_INPUTS_REQUIRED: {
          target: 'deploymentInputsForm'
        },
        DO_SEARCH_LOCATION: {
          target: 'locationSearching'
          // actions: ['assignDeploymentTopologyId']
        }
      }
    },
    deploymentInputsForm: {
      on: {
        // fixme : replace with a OnFormCompleted event (a form shouldn't be aware of the FSM logic)
        OnFormCompleted: {
          target: 'locationSearching'
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
        ON_LOCATION_FETCHED: {
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
        'ON_SELECT_LOCATION_SUCESSS': [
          {
            target: 'nodeMatchingForm',
            actions: ['assignDeploymentTopology'],
            cond: 'shouldAskForMatching'
          },
          {
            target: 'deploymentForm',
            actions: ['assignDeploymentTopology']
          }
        ]
      }

    },
    nodeMatchingForm: {
      on: {
        'ON_MATCHING_COMPLETED': {
          target: 'deploymentForm',
          actions: ['assignDeploymentTopology']
        }
      }
    },
    deploymentForm: {
      on: {
        DO_SUBMIT_DEPLOYMENT: {
          target: 'deploymentSubmitting',
          cond: 'canSubmitDeployment'
        }
      }
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

    undeploymentSubmitting: {
      invoke: {
        id: 'undeploy',
        src: 'undeploy'
      },
      on: {
        ON_UNDEPLOYMENT_SUBMIT_SUCCESS: {
          target: 'activeDeploymentForm',
          actions: ['clearError']
        },
        ON_UNDEPLOYMENT_SUBMIT_ERROR: {
          target: 'activeDeploymentForm',
          actions: ['assignError']
        }
      }
    },
    activeDeploymentForm: {
      on: {
        DO_SUBMIT_UNDEPLOYMENT: {
          target: 'undeploymentSubmitting',
          cond: 'canUndeploy'
          //actions: ['assignTargetId']
          // actions: ['assignUser', 'loginSuccess']
        },
        DO_SUBMIT_DEPLOYMENT: {
          target: 'deploymentSubmitting',
          cond: 'canDeploy'
        }
      }
    }
  },
};
