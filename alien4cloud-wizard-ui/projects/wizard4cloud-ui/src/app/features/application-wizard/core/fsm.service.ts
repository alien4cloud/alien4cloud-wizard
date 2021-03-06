import {fromEventPattern, of} from 'rxjs';
import {assign, EventObject, interpret, Machine, MachineOptions, State} from 'xstate';
import {catchError, map, mergeMap} from 'rxjs/operators';
import {Router} from '@angular/router';
import {
  ApplicationWizardMachineContext,
  ApplicationWizardMachineSchema
} from "@app/features/application-wizard/core/fsm.model";
import {
  ApplicationWizardMachineEvents, DoAskForWorkflowInputs,
  DoSelectEnvironment,
  DoSelectLocation,
  DoSelectTemplate,
  InitApplicationEnvironment,
  OnActiveDeploymentFound,
  OnApplicationCreateError,
  OnApplicationCreateSucess,
  OnApplicationDeleteError,
  OnApplicationDeleteSuccess,
  OnApplicationUpdateError,
  OnApplicationUpdateSuccess,
  OnDeploymentSubmitError,
  OnDeploymentSubmitSuccess, OnDeploymentTopologyFetched,
  OnEnvironmentsFetched,
  OnError,
  OnLocationFetched,
  OnMatchingCompleted,
  OnSelectLocationSuccesss,
  OnUndeploymentSubmitError,
  OnUndeploymentSubmitSuccess
} from "@app/features/application-wizard/core/fsm.events";
import {applicationWizardMachineConfig} from "@app/features/application-wizard/core/fsm.config";
import {FsmGraph, FsmGraphEdge, FsmGraphNode} from "@app/features/application-wizard/core/fsm-graph.model";
import {
  ApplicationDeploymentService,
  ApplicationEnvironmentService,
  ApplicationService,
  DeploymentTopologyService,
  LocationMatchingService,
  MetaPropertiesService, RuntimeService,
  TopologyService
} from "@app/core/services";
import * as lodash from 'lodash';
import {
  DeploymentStatus,
  DeploymentTopology,
  ProgessBarData,
  SuggestionContextType,
  SuggestionRequestContext
} from "@app/core/models";

/**
 * Manages the machine initialization.
 */
//@Injectable()
export class AppplicationWizardMachineService {

  constructor(
    private applicationService: ApplicationService,
    private topologyService: TopologyService,
    private applicationEnvironmentService: ApplicationEnvironmentService,
    private applicationDeploymentService: ApplicationDeploymentService,
    private locationMatchingService: LocationMatchingService,
    private deploymentTopologyService: DeploymentTopologyService,
    private metaPropertiesService: MetaPropertiesService,
    private runtimeService: RuntimeService,
    private router: Router
  ) { }

  machineOptions: Partial<MachineOptions<ApplicationWizardMachineContext, ApplicationWizardMachineEvents>> = {
    services: {
      createApplication: (_, event) =>
        this.applicationService
          .createApplication(event.applicationName, event.archiveName, _.topologyTemplate.id, event.applicationDescription)
          .pipe(
            mergeMap(applicationId =>
              this.applicationService.getById(applicationId).pipe(map(application => {
                _.application = application;
                _.propertyEditionContext.data.applicationId = application.id;
                return new OnApplicationCreateSucess(applicationId);
              }))
            ),
            catchError(err => {
              console.log("------------ Error catch by service : " + err);
              return of(new OnApplicationCreateError(err.message));
            })
          ),
      updateApplication: (_, event) =>
        this.applicationService
          .updateApplication(event.applicationId, event.applicationName, event.applicationDescription)
          .pipe(
            mergeMap(result =>
              this.applicationService.getById(event.applicationId).pipe(map(application => {
                _.application = application;
                return new OnApplicationUpdateSuccess();
              }))
            ),
            catchError(err => {
              console.log("------------ Error catch by service : " + err);
              return of(new OnApplicationUpdateError(err.message));
            })
          ),
      initWizardContextForExistingApplicationEnvironment: (_, event: InitApplicationEnvironment) =>
        // get the application
        this.applicationService.getById(event.applicationId).pipe(
          mergeMap(application => {
            _.application = application;
            _.propertyEditionContext.data.applicationId = event.applicationId;
            _.propertyEditionContext.data.environmentId = event.environmentId;
            // get the application environment
            return this.applicationEnvironmentService
              .getApplicationEnvironmentDTO(event.applicationId, event.environmentId)
              .pipe(
                mergeMap(environment => {
                  _.environment = environment;
                  // get the active deployment for this application / environment
                  return this.applicationDeploymentService
                    .getActiveDeployment(_.application.id, _.environment.id)
                    .pipe(
                      mergeMap(deployment => this.applicationEnvironmentService.getApplicationEnvironmentStatus(_.application.id, _.environment.id)
                        .pipe(
                          mergeMap(status =>
                            this.applicationDeploymentService.getActiveDeploymentTopology(
                              _.application.id,
                              _.environment.id
                            ).pipe(
                              map(dto => {
                                if (deployment) {
                                  _.deployment = deployment;
                                  _.deploymentStatus = status;
                                  _.deploymentTopology = <DeploymentTopology>dto.topology;
                                  return new OnActiveDeploymentFound(deployment, status);
                                } else {
                                  return new DoSelectEnvironment(_.environment);
                                }
                              })
                            )
                          ),
                          catchError(err => {
                            console.log("------------ Error catch by service : " + err);
                            // return new DoSelectEnvironment(_.environmentId);
                            // FIXME
                            return undefined;
                          })
                        )
                        // .pipe(map(
                        //   status => {
                        //     _.deployment = deployment;
                        //     _.deploymentStatus = status;
                        //     if (deployment) {
                        //       _.deployment = deployment;
                        //       _.deploymentStatus = status;
                        //       return new OnActiveDeploymentFound(deployment, status);
                        //     } else {
                        //       return new DoSelectEnvironment(_.environment);
                        //     }
                        //   }
                        // ))
                        //
                        // .pipe(
                        //   mergeMap(status =>
                        //     this.deploymentTopologyService.getDeploymentTopology(
                        //       _.application.id,
                        //       _.environment.id
                        //     ).pipe(
                        //       map(dto => {
                        //         //_.deploymentTopology = dto;
                        //         if (deployment) {
                        //           _.deployment = deployment;
                        //           _.deploymentStatus = status;
                        //           return new OnActiveDeploymentFound(deployment, status);
                        //         } else {
                        //           return new DoSelectEnvironment(_.environment);
                        //         }
                        //       })
                        //     )
                        //   ),
                        //   catchError(err => {
                        //     console.log("------------ Error catch by service : " + err);
                        //     // return new DoSelectEnvironment(_.environmentId);
                        //     // FIXME
                        //     return undefined;
                        //   })
                        // )
                      )
                    )
                  }
                )
              )
          }
        )
      ),
      searchEnvironments: (_, event) =>
        this.applicationEnvironmentService.search(
          {from: 0, size: 50, query: ""},
          { applicationId: _.application.id }
        ).pipe(
          map(environments => {
            if (environments.data.length == 1) {
              // we have just one env, we'll skip the environment selection form
              return new DoSelectEnvironment(environments.data[0]);
            } else {
              return new OnEnvironmentsFetched(environments.data);
            }
          })
        ),
      fetchDeploymentTopology: (_, event) =>
        this.deploymentTopologyService.getDeploymentTopology(
          _.application.id,
          _.environment.id
        ).pipe(
          map(dto => {
            // assign the deployment topology
            _.deploymentTopologyDTO = dto;
            _.deploymentTopology = dto.topology;
            _.propertyEditionContext.data.topologyId = dto.topology.id;
            return new OnDeploymentTopologyFetched();
              // return new DoSearchLocation(dto);
          })
        ),
      searchLocations: (_, event) =>
        this.locationMatchingService.match(_.deploymentTopologyDTO.topology.id, _.environment.id)
          .pipe(
            map(locations => {
              _.locations = locations;
              if (locations.length == 1) {
                console.log("Only one location exists :" + locations[0].location.id)
                return new DoSelectLocation(locations[0].location);
              } else {
                console.log("Several locations exist :" + locations.length)
                return new OnLocationFetched(locations);
              }
            })
          ),
      setLocationPolicies: (_, event) =>
        this.deploymentTopologyService.setLocationPolicies(_.application.id, _.environment.id, _.location.orchestratorId, _.location.id)
          .pipe(map(deploymentTopologyDTO => {
            // assign the deployment topology
            // we have an assignation in the FSM config but we are not guaranteed that this assignation was done before the guard was called
            // that's why we assign directly here
            _.deploymentTopologyDTO = deploymentTopologyDTO;
            _.deploymentTopology = deploymentTopologyDTO.topology;
            return new OnSelectLocationSuccesss(deploymentTopologyDTO);
          }))
      ,
      deploy: (_, event) =>
        this.applicationDeploymentService.deploy(
          _.application.id, _.environment.id
        ).pipe(
          mergeMap(data => this.applicationDeploymentService.getActiveDeployment(_.application.id, _.environment.id)
            .pipe(
              map(deployment => {
                _.deployment = deployment;
                return new OnDeploymentSubmitSuccess();
              })
            )
          ),
          catchError(err => {
            console.log("------------ Error catch by service : " + err);
            return of(new OnDeploymentSubmitError(err.message));
          })
        ),
      undeploy: (_, event) =>
        this.applicationDeploymentService.undeploy(
          _.application.id, _.environment.id
        ).pipe(
          map(data => new OnUndeploymentSubmitSuccess()),
          catchError(err => {
            return of(new OnUndeploymentSubmitError(err.message));
          })
        ),
      deleteApplication: (_, event) =>
        this.applicationService.delete(
          _.application.id
        ).pipe(
          catchError(err => {
            return of(new OnApplicationDeleteError(err.message));
          })
        ).pipe(
          map(data => {
            // FIXME: switchMap ?
            if (data instanceof OnApplicationDeleteError) {
              return <OnApplicationDeleteError>data;
            }
            return new OnApplicationDeleteSuccess();
          })
        )
    },
    guards: {
      hasMetapropertiesConfig: context => context.applicationMetapropertiesConfiguration != undefined,
      deploymentTopologyHasInputs: context => context.deploymentTopologyDTO && context.deploymentTopologyDTO.topology.inputs && lodash.size(context.deploymentTopologyDTO.topology.inputs) > 0,
      deploymentTopologyHasInputArtifacts: context => context.deploymentTopologyDTO && context.deploymentTopologyDTO.topology.inputArtifacts && lodash.size(context.deploymentTopologyDTO.topology.inputArtifacts) > 0,
      shouldAskForMatching: _ => this.deploymentTopologyService.hasAvailableSubstitutions(_.deploymentTopologyDTO.availableSubstitutions.availableSubstitutions)
        || this.deploymentTopologyService.hasAvailableSubstitutions(_.deploymentTopologyDTO.availableSubstitutions.availablePoliciesSubstitutions),
      canUndeploy: context => context.deployment && (
        context.deploymentStatus === DeploymentStatus.DEPLOYED
        || context.deploymentStatus === DeploymentStatus.FAILURE
        || context.deploymentStatus === DeploymentStatus.UPDATE_FAILURE
        || context.deploymentStatus === DeploymentStatus.UPDATED
        || context.deploymentStatus === DeploymentStatus.DEPLOYMENT_IN_PROGRESS),
      canLaunchWorkflow: context => context.deployment && (
        context.deploymentStatus === DeploymentStatus.DEPLOYED
        || context.deploymentStatus === DeploymentStatus.FAILURE
        || context.deploymentStatus === DeploymentStatus.UPDATE_FAILURE
        || context.deploymentStatus === DeploymentStatus.UPDATED),
      canDeploy: context => context.deployment && context.deploymentStatus === DeploymentStatus.UNDEPLOYED,
      canSubmitDeployment: context => context.deploymentTopologyDTO && context.deploymentTopologyDTO.validation && context.deploymentTopologyDTO.validation.valid,
      canCancelWithoutDeleting: context => context.application == undefined,
      applicationExists: context => context.application != undefined,
      hasntActiveEnvironment: context => context.environments && context.environments.filter(e => e.status != DeploymentStatus.UNDEPLOYED).length == 0
    },
    actions: {
      // FIXME: this should'nt be necessary
      clearContext: (_) => {
        _.topologyTemplate = undefined;
        _.applicationMetapropertiesConfiguration = undefined;
        _.application = undefined;
        _.environments = undefined;
        _.deploymentTopologyDTO = undefined;
        _.deploymentTopology = undefined;
        _.environment = undefined;
        _.location = undefined;
        _.errorMessage = undefined;
        _.locations = undefined;
        _.deployment = undefined;
        _.deploymentStatus = undefined;
        _.workflowId = undefined;
        _.progessBarData = undefined;
        _.propertyEditionContext = new SuggestionRequestContext();
      },
      assignTemplate: assign<ApplicationWizardMachineContext, DoSelectTemplate>((_, event) => ({
        topologyTemplate: event.topology
      })),
      assignEnvironments: assign<ApplicationWizardMachineContext, OnEnvironmentsFetched>((_, event) => ({
        environments: event.environments
      })),
      assignEnvironment: assign<ApplicationWizardMachineContext, DoSelectEnvironment>((_, event) => ({
        environment: event.environment,
        propertyEditionContext: {type: _.propertyEditionContext.type, data: {..._.propertyEditionContext.data, ...{environmentId: event.environment.id}}}
      })),
      setPropertyContextTypeToDeploymentInput: assign<ApplicationWizardMachineContext>((_) => ({
        propertyEditionContext: {type: SuggestionContextType.DeploymentInput, data: _.propertyEditionContext.data}
      })),
      assignError: assign<ApplicationWizardMachineContext, OnError>((_, event) => ({
        errorMessage: event.message
      })),
      assignLocation: assign<ApplicationWizardMachineContext, DoSelectLocation>((_, event) => ({
        location: event.location
      })),
      assignLocations: assign<ApplicationWizardMachineContext, OnLocationFetched>((_, event) => ({
        locations: event.locations
      })),
      assignWorkflowId: assign<ApplicationWizardMachineContext, DoAskForWorkflowInputs>((_, event) => ({
        workflowId: event.workflowId
      })),
      clearError: assign<ApplicationWizardMachineContext, any>((_, event) => ({
        errorMessage: undefined
      })),
      // FIXME: remove since it's useless ? (assignation is done in setLocationPolicies)
      assignDeploymentTopology: assign<ApplicationWizardMachineContext, OnSelectLocationSuccesss | OnMatchingCompleted>((_, event) => ({
        deploymentTopologyDTO: event.deploymentTopologyDTO
      })),
      fetchLocations: (_) => {
        var topologyId = _.environment.applicationId + ":" + _.environment.deployedVersion;
         this.locationMatchingService.match(topologyId, _.environment.id).subscribe(
          locations => {
            _.locations = locations;
          })
      },
      fetchApplicationMetaProperties: (_) => {
        this.metaPropertiesService.search({from: 0, size: 1000, query: "", filters: {"target":["application"]}})
          .subscribe(
            metaprops => {
              if (metaprops.totalResults > 0) {
                // assign the meta properties config in the context
                _.applicationMetapropertiesConfiguration = metaprops.data;
              }
            }
          )
      },
      fetchEnvironments: (_) => {
        this.applicationEnvironmentService.search({from: 0, size: 50, query: ""},
          { applicationId: _.application.id }
        ).subscribe(environments => {
          _.environments = environments.data;
        });
      },
      refreshApplication: (_) => {
        this.applicationService.getById(_.application.id).subscribe(application => {
          _.application = application;
        });
      },
      refreshDeploymentTopology: (_) => {
        this.deploymentTopologyService.getDeploymentTopology(
          _.application.id,
          _.environment.id
        ).subscribe(dto => {
          _.deploymentTopologyDTO = dto;
          _.deploymentTopology = dto.topology;
        })
      },
      initProgress: (_) => {
        _.progessBarData = new ProgessBarData();
        _.progessBarData.workflowInProgress = true;
      }

    }

  };

  private _applicationWizardMachine = Machine<ApplicationWizardMachineContext, ApplicationWizardMachineSchema, ApplicationWizardMachineEvents>(
    applicationWizardMachineConfig
  ).withConfig(this.machineOptions);
  private service = undefined;


  /**
   * This subject will broadcast state changed events (AKA transition).
   */
  applicationWizardState$ = fromEventPattern<[State<ApplicationWizardMachineContext, ApplicationWizardMachineEvents>, EventObject]>(
    handler => {
      return this.service.onTransition(handler);
    },
    (_, service) => service.stop()
  ).pipe(map(([state, _]) => state));

  start() {
    this.service = interpret(this._applicationWizardMachine, { devTools: true }).start();
  }

  stop() {
    this.service.stop();
  }

  /**
   * Send an event to the machine in order to trigger a transition.
   * @param event
   */
  send(event: ApplicationWizardMachineEvents) {
    this.service.send(event);
  }

  getGraph() {
    const graph = new FsmGraph();
    // console.log("Initial state : " + applicationWizardMachineConfig.initial);

    Object.entries(applicationWizardMachineConfig.states).forEach(([state, value]) => {
      // console.log(`Add a state <${state}>`);
      graph.nodes.push(new FsmGraphNode(state, state));
      // console.log("ON: ", value.on);

      if (value.on) {
        Object.entries(value.on).forEach(([eventType, transitions]) => {
          // console.log("transitions: " + transitions);
          console.log("eventType: " + eventType);
          console.log("transitions: " + JSON.stringify(transitions));
          let target = undefined;
          console.log("isArray ? ", lodash.isArray(transitions));
          if (lodash.isArray(transitions)) {
            // we have several transitions from here
            lodash.forEach(transitions, (transition) => {
              console.log("==> ", transition);
              target = transition['target'];
              if (eventType == '' || !eventType) {
                graph.edges.push(new FsmGraphEdge(state + "-On", state, target, "", []));
              } else {
                graph.edges.push(new FsmGraphEdge(state + "-" + eventType + "-" + target, state, target, eventType, []));
              }
            });
          } else {
            target = transitions['target'];
            // console.log("target: " + target);
            if (eventType == '' || !eventType) {
              graph.edges.push(new FsmGraphEdge(state + "-On", state, target, "", []));
            } else {
              // push event as a node
              // graph.nodes.push(new FsmGraphNode(eventType.toString()));
              // // add a edge between the state node and it
              // graph.edges.push(new FsmGraphEdge(state + ":On:" + eventType, state, eventType));
              // add a edge between the event and target
              // console.log(`Add a edge <${eventType}> from ${state} to ${target}`);
              graph.edges.push(new FsmGraphEdge(state + "-" + eventType + "-" + target, state, target, eventType, []));
            }
          }
          // if (transitions[0]) {
          //   target = transitions[0]['target'];
          // } else if (transitions['target']) {
          //   target = transitions['target'];
          // }

        });
      }
    });
    // console.log("graph: " + JSON.stringify(graph));
    return graph;
  }


}
