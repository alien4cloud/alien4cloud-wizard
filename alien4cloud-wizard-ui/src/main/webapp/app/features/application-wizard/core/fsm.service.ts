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
import {
  ApplicationWizardMachineContext,
  ApplicationWizardMachineSchema
} from "@app/features/application-wizard/core/fsm.model";
import {
  ApplicationWizardMachineEvents,
  DoCreateApplication,
  DoSelectTemplate,
  OnApplicationCreateError,
  OnApplicationCreateSucess,
  DoSelectLocation,
  OnError,
  OnEnvironmentsFetched,
  DoSelectEnvironment,
  OnDeploymentSubmitSucess,
  OnLocationFetched,
  OnDeploymentTopologyFetched,
  OnDeploymentSubmitError,
  OnSelectLocationSucesss,
  InitApplicationEnvironment, OnActiveDeploymentFound
} from "@app/features/application-wizard/core/fsm.events";
import { applicationWizardMachineConfig } from "@app/features/application-wizard/core/fsm.config";
import { FsmGraph, FsmGraphEdge, FsmGraphNode } from "@app/features/application-wizard/core/fsm-graph.model";
import * as _ from "lodash";
import {
  ApplicationService,
  ApplicationEnvironmentService,
  ApplicationDeploymentService,
  LocationMatchingService,
  TopologyService,
  Deployment,
  Execution} from "@app/core";

/**
 * Manages the machine initialization.
 */
@Injectable()
export class AppplicationWizardMachineService {

  constructor(
    private applicationService: ApplicationService,
    private topologyService: TopologyService,
    private applicationEnvironmentService: ApplicationEnvironmentService,
    private applicationDeploymentService: ApplicationDeploymentService,
    private locationMatchingService: LocationMatchingService,
    private router: Router
  ) { }

  machineOptions: Partial<MachineOptions<ApplicationWizardMachineContext, ApplicationWizardMachineEvents>> = {
    services: {
      createApplication: (_, event) =>
        this.applicationService
          .createApplication( _.applicationName, _.applicationName, _.templateId, _.applicationDescription)
          .pipe(
            map(applicationId => new OnApplicationCreateSucess(applicationId)),
            catchError(err => {
              console.log("------------ Error catch by service : " + err);
              return of(new OnApplicationCreateError(err.message));
            })
          ),
      getActiveDeployment: (_, event) =>
        this.applicationDeploymentService
          .getActiveDeployment(_.applicationId, _.environmentId)
          .pipe(
            map(deployment => {
              if (deployment) {
                return new OnActiveDeploymentFound(deployment);
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
          ),
      searchEnvironments: (_, event) =>
        this.applicationEnvironmentService.search(
          0,
          50,
          "",
          { applicationId: _.applicationId }
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
        this.applicationEnvironmentService.getDeploymentTopology(
          _.applicationId,
          _.environmentId
        ).pipe(
          map(dto => new OnDeploymentTopologyFetched(dto))
        ),
        
      searchLocations: (_, event) =>
        this.locationMatchingService.match(_.deploymentTopologyId, _.environmentId)
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
        this.applicationEnvironmentService.setLocationPolicies(_.applicationId, _.environmentId, _.orchestratorId, _.locationId)
          .pipe(map(data => {
            console.log("setLocation result ", JSON.stringify(data));
            return new OnSelectLocationSucesss();
          }))
      ,
      deploy: (_, event) =>
        this.applicationDeploymentService.deploy(
          _.applicationId, _.environmentId
        ).pipe(
          map(data => new OnDeploymentSubmitSucess()),
          catchError(err => {
            console.log("------------ Error catch by service : " + err);
            return of(new OnDeploymentSubmitError(err.message));
          })
        )
    },
    guards: {
      // isLoggedOut: () => !localStorage.getItem('jwtToken')
    },
    actions: {
      assignTemplate: assign<ApplicationWizardMachineContext, DoSelectTemplate>((_, event) => ({
        templateId: event.templateId, templateDescription: event.templateDescription
      })),
      assignAppInfo: assign<ApplicationWizardMachineContext, DoCreateApplication>((_, event) => ({
        applicationName: event.name, applicationDescription: event.description
      })),
      assignAppId: assign<ApplicationWizardMachineContext, OnApplicationCreateSucess>((_, event) => ({
        applicationId: event.applicationId
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
      assignDeploymentTopologyId: assign<ApplicationWizardMachineContext, OnDeploymentTopologyFetched>((_, event) => ({
        deploymentTopologyId: event.deploymentTopology.topology.id
      })),
      // TODO: remove
      assignDeploymentId: (_) => {
          this.applicationEnvironmentService.getMonitoredDeploymentDTO(
            _.applicationId,
            _.environmentId
          ).subscribe((deployment: Deployment) => {
            console.log("Monitored Deployment ID :", deployment.id);
            _.deploymentId = deployment.id ; 
          });     
      },
      // TODO: remove
      deploymentStatusCheck : (_) => {
        this.applicationService.checkdeploymentStatus(
          _.deploymentId
        ).subscribe((execution: Execution) => {
          console.log("Execution Status :", execution.status);
      })}   
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
          // console.log("eventType: " + eventType);
          // console.log("transitions: " + JSON.stringify(transitions));
          let target = undefined;
          if (transitions[0]) {
            target = transitions[0]['target'];
          } else if (transitions['target']) {
            target = transitions['target'];
          }
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
        });
      }
    });
    // console.log("graph: " + JSON.stringify(graph));
    return graph;
  }


}
