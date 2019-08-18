import {fromEventPattern, of} from 'rxjs';
import {assign, EventObject, interpret, Machine, MachineOptions, State} from 'xstate';
import {catchError, map, mergeMap} from 'rxjs/operators';
import {Router} from '@angular/router';
import {
  ApplicationWizardMachineContext,
  ApplicationWizardMachineSchema
} from "@app/features/application-wizard/core/fsm.model";
import {
  ApplicationWizardMachineEvents,
  DoSearchLocation,
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
  OnDeploymentInputsRequired,
  OnDeploymentSubmitError,
  OnDeploymentSubmitSuccess,
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
  DeploymentStatus,
  DeploymentTopologyService,
  LocationMatchingService,
  MetaPropertiesService,
  TopologyService
} from "@app/core";
import * as lodash from 'lodash';

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
            // get the active deployment for this application / environment
            return this.applicationDeploymentService
              .getActiveDeployment(_.application.id, _.environmentId)
              .pipe(
                mergeMap(deployment => this.applicationEnvironmentService.getApplicationEnvironmentStatus(_.application.id, _.environmentId)
                  .pipe(
                    map(status => {
                      if (deployment) {
                        return new OnActiveDeploymentFound(deployment, status);
                      } else {
                        return new DoSelectEnvironment(_.environmentId);
                      }
                    }),
                    catchError(err => {
                      console.log("------------ Error catch by service : " + err);
                      // return new DoSelectEnvironment(_.environmentId);
                      // FIXME
                      return undefined;
                    })
                  )
                )
              )
          }
        )
      ),
      _getActiveDeployment: (_, event: InitApplicationEnvironment) =>
        this.applicationService.getById(event.applicationId).pipe(
          mergeMap(application => {
            _.application = application;
            return this.applicationDeploymentService
              .getActiveDeployment(_.application.id, _.environmentId)
              .pipe(
                mergeMap(deployment => this.applicationEnvironmentService.getApplicationEnvironmentStatus(_.application.id, _.environmentId)
                  .pipe(
                    map(status => {
                      if (deployment) {
                        return new OnActiveDeploymentFound(deployment, status);
                      } else {
                        return new DoSelectEnvironment(_.environmentId);
                      }
                    }),
                    catchError(err => {
                      console.log("------------ Error catch by service : " + err);
                      // return new DoSelectEnvironment(_.environmentId);
                      // FIXME
                      return undefined;
                    })
                  )
                )
              )
          }
        )
      ),
      searchEnvironments: (_, event) =>
        this.applicationEnvironmentService.search(
          0,
          50,
          "",
          {},
          { applicationId: _.application.id }
        ).pipe(
          map(environments => {
            if (environments.data.length == 1) {
              // we have just one env, we'll skip the environment selection form
              return new DoSelectEnvironment(environments.data[0].id);
            } else {
              return new OnEnvironmentsFetched(environments.data);
            }
          })
        ),
      fetchDeploymentTopology: (_, event) =>
        this.deploymentTopologyService.getDeploymentTopology(
          _.application.id,
          _.environmentId
        ).pipe(
          map(dto => {
            // assign the deployment topology
            _.deploymentTopology = dto;
            if (dto.topology.inputs && lodash.size(dto.topology.inputs) > 0) {
              return new OnDeploymentInputsRequired();
            } else {
              return new DoSearchLocation(dto);
            }
          })
        ),
      searchLocations: (_, event) =>
        this.locationMatchingService.match(_.deploymentTopology.topology.id, _.environmentId)
          .pipe(
            map(locations => {
              if (locations.length == 1) {
                console.log("Only one location exists :" + locations[0].location.id)
                return new DoSelectLocation(locations[0].location.id,locations[0].location.name, locations[0].orchestrator.id );
              } else {
                console.log("Several locations exist :" + locations.length)
                return new OnLocationFetched(locations);
              }
            })
          ),
      setLocationPolicies: (_, event) =>
        this.deploymentTopologyService.setLocationPolicies(_.application.id, _.environmentId, _.orchestratorId, _.locationId)
          .pipe(map(deploymentTopologyDTO => {
            // assign the deployment topology
            // we have an assignation in the FSM config but we are not guaranteed that this assignation was done before the guard was called
            // that's why we assign directly here
            _.deploymentTopology = deploymentTopologyDTO;
            return new OnSelectLocationSuccesss(deploymentTopologyDTO);
          }))
      ,
      deploy: (_, event) =>
        this.applicationDeploymentService.deploy(
          _.application.id, _.environmentId
        ).pipe(
          map(data => new OnDeploymentSubmitSuccess()),
          catchError(err => {
            console.log("------------ Error catch by service : " + err);
            return of(new OnDeploymentSubmitError(err.message));
          })
        ),
      undeploy: (_, event) =>
        this.applicationDeploymentService.undeploy(
          _.application.id, _.environmentId
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
      deploymentTopologyHasInputs: context => context.deploymentTopology && context.deploymentTopology.topology.inputs && lodash.size(context.deploymentTopology.topology.inputs) > 0,
      shouldAskForMatching: _ => this.deploymentTopologyService.hasMultipleAvailableSubstitutions(_.deploymentTopology),
      canUndeploy: context => context.deploymentId && (
        context.deploymentStatus === DeploymentStatus.DEPLOYED
        || context.deploymentStatus === DeploymentStatus.FAILURE
        || context.deploymentStatus === DeploymentStatus.UPDATE_FAILURE
        || context.deploymentStatus === DeploymentStatus.DEPLOYMENT_IN_PROGRESS),
      canDeploy: context => context.deploymentId && context.deploymentStatus === DeploymentStatus.UNDEPLOYED,
      canSubmitDeployment: context => context.deploymentTopology && context.deploymentTopology.validation && context.deploymentTopology.validation.valid,
      canCancelWithoutDeleting: context => context.application == undefined,
      applicationExists: context => context.application != undefined,
      hasntActiveEnvironment: context => context.environments && context.environments.filter(e => e.status != DeploymentStatus.UNDEPLOYED).length == 0
    },
    actions: {
      assignTemplate: assign<ApplicationWizardMachineContext, DoSelectTemplate>((_, event) => ({
        topologyTemplate: event.topology
      })),
      assignDeployment: assign<ApplicationWizardMachineContext, OnActiveDeploymentFound>((_, event) => ({
        deploymentId: event.deployment.id,
        deploymentStatus : event.deploymentStatus
      })),
      assignAppInitInfo: assign<ApplicationWizardMachineContext, InitApplicationEnvironment>((_, event) => ({
        applicationId: event.applicationId, environmentId: event.environmentId
      })),
      assignEnvironments: assign<ApplicationWizardMachineContext, OnEnvironmentsFetched>((_, event) => ({
        environments: event.environments
      })),
      assignEnvironmentId: assign<ApplicationWizardMachineContext, DoSelectEnvironment>((_, event) => ({
        environmentId: event.environmentId
      })),
      assignError: assign<ApplicationWizardMachineContext, OnError>((_, event) => ({
        errorMessage: event.message
      })),
      assignLocationId: assign<ApplicationWizardMachineContext, DoSelectLocation>((_, event) => ({
        locationId: event.locationId, locationName: event.locationName,  orchestratorId: event.orchestratorId
      })),
      assignLocation: assign<ApplicationWizardMachineContext, OnLocationFetched>((_, event) => ({
        locations: event.locations
      })),
      clearError: assign<ApplicationWizardMachineContext, any>((_, event) => ({
        errorMessage: undefined
      })),
      // FIXME: remove since it's useless ? (assignation is done in setLocationPolicies)
      assignDeploymentTopology: assign<ApplicationWizardMachineContext, OnSelectLocationSuccesss | OnMatchingCompleted>((_, event) => ({
        deploymentTopology: event.deploymentTopologyDTO
      })),
      fetchDeploymentTopologyAndLocations: (_) => {
        this.deploymentTopologyService.getDeploymentTopology(
          _.application.id,
          _.environmentId
        ).pipe(
          mergeMap(dto => {
            // assign the deployment topology
            _.deploymentTopology = dto;
            return this.locationMatchingService.match(_.deploymentTopology.topology.id, _.environmentId);
          })).subscribe(
          locations => {
            _.locations = locations;
          }
        )
      },
      fetchApplicationMetaProperties: (_) => {
        this.metaPropertiesService.search(0, 1000, "", {"target":["application"]})
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
        this.applicationEnvironmentService.search(
          0,
          50,
          "",
          {},
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
          _.environmentId
        ).subscribe(dto => {
          _.deploymentTopology = dto;
        })
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
