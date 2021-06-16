import { MachineConfig, actions } from 'xstate';
import {
  ApplicationWizardMachineContext,
  ApplicationWizardMachineSchema
} from "@app/features/application-wizard/core/fsm.model";
import {
  ApplicationWizardMachineEvents
} from "@app/features/application-wizard/core/fsm.events";
import {SuggestionRequestContext} from "@app/core/models";

const { log } = actions;

/**
 * The initial machine context.
 */
export const context: ApplicationWizardMachineContext = {
  topologyTemplate: undefined,
  applicationMetapropertiesConfiguration: undefined,
  application: undefined,
  environments: undefined,
  deploymentTopologyDTO: undefined,
  deploymentTopology: undefined,
  environment: undefined,
  location: undefined,
  errorMessage: undefined,
  locations: undefined,
  deployment: undefined,
  deploymentStatus: undefined,
  workflowId: undefined,
  progessBarData: undefined,
  propertyEditionContext: new SuggestionRequestContext()
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
      entry: ['fetchApplicationMetaProperties', 'clearContext'],
      on: {
        INIT: [
          {
            target: 'templateSelectionForm',
            actions: log(
              (context, event) => `boot: ${JSON.stringify(context)}`,
              'applicationWizard'
            )
          }
        ],
        InitApplicationEnvironment: [
          {
            target: 'applicationEnvironmentInitializing',
            // actions: ['assignAppInitInfo']
          }
        ],
        DoCancelWizard: {
          target: 'theEnd'
        }
      }
    },
    applicationEnvironmentInitializing: {
      invoke: {
        id: 'initWizardContextForExistingApplicationEnvironment',
        src: 'initWizardContextForExistingApplicationEnvironment'
      },
      on: {
        // FIXME: a single OnAppEnvInitialiazed with guards will be better
        OnActiveDeploymentFound: {
          target: 'activeDeploymentForm',
          actions: [/*'assignDeployment',*/'fetchLocations']
        },
        DoSelectEnvironment: {
          target: 'environmentSelected'
        }
      }
    },
    templateSelectionForm: {
      on: {
        DoSelectTemplate: {
          target: 'templateSelected',
          actions: ['assignTemplate']
        },
        DoCancelWizard: {
          target: 'theEnd'
        }
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
        DoCreateApplication: {
          target: 'applicationCreating'
        },
        DoUpdateApplication: {
          target: 'applicationUpdating'
        },
        GoBack: {
          target: 'templateSelectionForm'
        },
        DoCancelWizard: [
          {
          target: 'theEnd',
          cond: 'canCancelWithoutDeleting'
          },
          {
            target: 'deleteApplicationForm',
            cond: 'applicationExists'
          }
        ]
      }
    },
    applicationMetapropertiesForm: {
      on: {
        GoBack: {
          target: 'applicationCreateForm'
        },
        OnFormCompleted: {
          target: 'environmentSearching',
          // We need to refresh the application in order to have metaproperties on it
          // and to be able to come back to this form with correct values displayed
          // actions: ['refreshApplication']
        },
        DoCancelWizard: {
          target: 'deleteApplicationForm'
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
        OnApplicationCreateSucess: [
          {
            target: 'applicationMetapropertiesForm',
            // FIXM%E: trigger and forget
            actions: ['clearError'],
            cond: 'hasMetapropertiesConfig'
          },
          {
            target: 'environmentSearching',
            // FIXM%E: trigger and forget
            actions: ['clearError']
          }
        ],
        OnApplicationCreateError: {
          target: 'applicationCreationError',
          actions: ['assignError']
        }
      }
    },
    applicationUpdating: {
      invoke: {
        id: 'updateApplication',
        src: 'updateApplication'
      },
      on: {
        OnApplicationUpdateSuccess: [
          {
            target: 'applicationMetapropertiesForm',
            actions: ['clearError'],
            cond: 'hasMetapropertiesConfig'
          },
          {
            target: 'environmentSearching',
            actions: ['clearError']
          }
        ],
        OnApplicationUpdateError: {
          target: 'applicationCreateForm',
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
        DoSelectEnvironment: {
          target: 'environmentSelected',
          actions: ['assignEnvironment']
        },
        OnEnvironmentsFetched: {
          target: 'environmentSelectionForm',
          actions: ['assignEnvironments']
        }
      }
    },
    environmentSelectionForm: {
      on: {
        DoSelectEnvironment: {
          target: 'environmentSelected',
          actions: ['assignEnvironment']
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
        OnDeploymentTopologyFetched: [
          {
          target: 'deploymentInputsForm',
            cond: 'deploymentTopologyHasInputs',
            actions: ['setPropertyContextTypeToDeploymentInput']
          },
          {
            target: 'deploymentInputArtifactsForm',
            cond: 'deploymentTopologyHasInputArtifacts'
          },
          {
            target: 'locationSearching'
          }
        ]
      }
    },
    deploymentInputsForm: {
      on: {
        GoBack: [
          {
            target: 'applicationMetapropertiesForm',
            cond: 'hasMetapropertiesConfig'
          },
          {
            target: 'applicationCreateForm'
          }
        ],
        OnFormCompleted: [
          {
            target: 'deploymentInputArtifactsForm',
            cond: 'deploymentTopologyHasInputArtifacts'
          },
          {
            target: 'locationSearching',
          // refresh the deploymentTopology in order to ensure it contains input values
          // this to be able to back to this form in case of new application
          // actions: ['refreshDeploymentTopology']
          }
        ],
        DoCancelWizard: {
          target: 'deleteApplicationForm'
        }
      }
    },
    deploymentInputArtifactsForm: {
      on: {
        GoBack: [
          {
            target: 'deploymentInputsForm',
            cond: 'deploymentTopologyHasInputs'
          },
          {
            target: 'applicationMetapropertiesForm',
            cond: 'hasMetapropertiesConfig'
          },
          {
            target: 'applicationCreateForm'
          }
        ],
        OnFormCompleted: {
          target: 'locationSearching',
          // refresh the deploymentTopology in order to ensure it contains input values
          // this to be able to back to this form in case of new application
          // actions: ['refreshDeploymentTopology']
        },
        DoCancelWizard: {
          target: 'deleteApplicationForm'
        }
      }
    },
    locationSearching: {
      invoke: {
        id: 'searchLocations',
        src: 'searchLocations'
      },
      on: {
        DoSelectLocation: {
          target: 'locationSelected',
          actions: ['assignLocation']
        },
        OnLocationFetched: {
          target: 'locationSelectionForm',
          // FIXME: remove, the job is done in invocation
          actions: ['assignLocations']
        }
      }
    },
    locationSelectionForm: {
      on: {
        GoBack: [
          {
            target: 'deploymentInputArtifactsForm',
            cond: 'deploymentTopologyHasInputArtifacts'
          },
          {
            target: 'deploymentInputsForm',
            cond: 'deploymentTopologyHasInputs'
          },
          {
            target: 'applicationMetapropertiesForm',
            cond: 'hasMetapropertiesConfig'
          }
        ],
        DoSelectLocation: {
          target: 'locationSelected',
          actions: ['assignLocation']
        },
        DoCancelWizard: {
          target: 'deleteApplicationForm'
        }
      }
    },
    locationSelected: {
      invoke: {
        id: 'setLocationPolicies',
        src: 'setLocationPolicies'
      },
      on: {
        OnSelectLocationSucesss: [
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
        GoBack: {
          target: 'locationSelectionForm'
        },
        OnMatchingCompleted: {
          target: 'deploymentForm',
          actions: ['assignDeploymentTopology']
        },
        DoCancelWizard: {
          target: 'deleteApplicationForm'
        }
      }
    },
    deploymentForm: {
      on: {
        GoBack: [
          {
            target: 'nodeMatchingForm',
            cond: 'shouldAskForMatching'
          },
          {
            target: 'locationSelectionForm'
          }
        ],
        DoSubmitDeployment: {
          target: 'deploymentSubmitting',
          cond: 'canSubmitDeployment'
        },
        DoCancelWizard: {
          target: 'deleteApplicationForm'
        }
      }
    },
    deploymentSubmitting: {
      invoke: {
        id: 'deploy',
        src: 'deploy'
      },
      on: {
        OnDeploymentSubmitSuccess: {
          target: 'activeDeploymentForm',
          actions: ['initProgress']
        },
        OnDeploymentSubmitError: {
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
        OnUndeploymentSubmitSuccess: {
          target: 'activeDeploymentForm',
          actions: ['clearError']
        },
        OnUndeploymentSubmitError: {
          target: 'activeDeploymentForm',
          actions: ['assignError']
        }
      }
    },
    activeDeploymentForm: {
      on: {
        GoBack: [
          {
            target: 'locationSearching'
          }
        ],
        DoSubmitUndeployment: {
          target: 'undeploymentSubmitting',
          cond: 'canUndeploy'
        },
        DoSubmitDeployment: {
          target: 'deploymentSubmitting',
          cond: 'canDeploy'
        },
        DoAskForWorkflowInputs: {
          target: 'workflowInputsForm',
          actions: ['assignWorkflowId'],
          cond: 'canLaunchWorkflow'
        },
        DoCancelWizard: {
          target: 'deleteApplicationForm'
        }
      }
    },
    workflowInputsForm: {
      on: {
        GoBack: [
          {
            target: 'activeDeploymentForm'
          }
        ],
        OnWorkflowLaunched: [
          {
            target: 'activeDeploymentForm'
          }
        ]
      }
    },
    deleteApplicationForm: {
      entry: ['fetchEnvironments'],
      on: {
        DoDeleteApplication: {
          target: 'applicationDeleting'
          // TODO: add cond
        },
        DoCancelWizard: {
          target: 'theEnd'
        }
      }
    },
    applicationDeleting: {
      invoke: {
        id: 'deleteApplication',
        src: 'deleteApplication'
      },
      on: {
        OnApplicationDeleteSuccess: {
          target: 'theEnd'
        },
        OnApplicationDeleteError: {
          target: 'deleteApplicationForm',
          actions: ['assignError']
        }
      }
    },
    theEnd: {
      type: 'final'
    }
  },
};
