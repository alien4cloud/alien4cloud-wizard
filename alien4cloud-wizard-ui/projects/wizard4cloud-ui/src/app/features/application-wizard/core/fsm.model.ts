import {
  Application,
  ApplicationEnvironmentDTO, Deployment,
  DeploymentStatus, DeploymentTopology,
  DeploymentTopologyDTO, Location,
  LocationMatch,
  ProgessBarData, Topology
} from '@app/core/models';
import {MetaPropConfiguration} from "@alien4cloud/wizard4cloud-commons";

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
    deploymentInputArtifactsForm:{};
    locationSelectionForm: {};
    locationSearching: {};
    locationSelected: {};
    nodeMatchingForm: {};
    deploymentForm: {};
    deploymentSubmitting:{},
    activeDeploymentForm:{},
    workflowInputsForm:{},
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

  environments: ApplicationEnvironmentDTO[];
  deploymentTopologyDTO: DeploymentTopologyDTO;
  deploymentTopology: DeploymentTopology;
  errorMessage: string;

  /**
   * The environment we are working on.
   */
  environment: ApplicationEnvironmentDTO;

  /**
   * All the possible locations for the current deployment.
   */
  locations: LocationMatch[];

  /**
   * The location that has been selected as a deployment target.
   */
  location: Location;

  /**
   * The active deployment if exist.
   */
  deployment: Deployment;

  /**
   * The active deployment status if exist.
   */
  deploymentStatus: DeploymentStatus;

  /**
   * The workflowId when the workflow needs inputs.
   */
  workflowId: string;

  /**
   * The active deployment progress data if exist.
   */
  progessBarData: ProgessBarData;
}

