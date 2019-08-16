import {
  Application,
  ApplicationEnvironment,
  DeploymentStatus,
  DeploymentTopologyDTO,
  LocationMatch,
  MetaPropConfiguration, Topology
} from '@app/core';

/**
 * Specify the schema of our state machine configuration.
 */
export interface ApplicationWizardMachineSchema {
  states: {
    boot: {};
    applicationEnvironmentInitializing: {}
    templateSelectionForm: {};
    templateSelected: {};
    applicationCreateForm: {};
    applicationCreating: {};
    applicationUpdating: {};
    applicationMetapropertiesForm: {};
    applicationCreationError: {};
    environmentSearching: {};
    environmentSelectionForm: {};
    environmentSelected: {};
    deploymentTopologyFetching:{};
    deploymentInputsForm:{};
    locationSelectionForm: {};
    locationSearching: {};
    locationSelected: {};
    nodeMatchingForm: {};
    deploymentForm: {};
    deploymentSubmitting:{},
    activeDeploymentForm:{},
    undeploymentSubmitting:{},
    deleteApplicationForm:{},
    applicationDeleting:{},
    theEnd:{},
  };
}

/**
 * This context will we available in states emitted by FSM.
 * It holds all the data that our wizard will have to store.
 */
export interface ApplicationWizardMachineContext {

  /**
   * The topology template that have been chosen.
   */
  topologyTemplate: Topology;

  /**
   * The application : not set if the application has not yet been created.
   */
  application: Application;

  /**
   * The meta-properties that need to be defined for an application.
   */
  applicationMetapropertiesConfiguration: MetaPropConfiguration[];

  environments: ApplicationEnvironment[];
  deploymentTopology: DeploymentTopologyDTO;
  errorMessage: string;
  environmentId: string;
  // FIXME: replace by a single Location Object
  locationId: string;
  // FIXME: replace by a single Location Object
  locationName: string;
  locations: LocationMatch[];
  // FIXME: replace by a single Location Object
  orchestratorId: string;
  deploymentId: string;
  deploymentStatus: DeploymentStatus;
}
