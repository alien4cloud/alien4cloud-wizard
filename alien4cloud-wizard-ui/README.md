# Alien4Cloud Wizard

## How-to use

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.0.3.

You should run ```mvn install -DskipTests``` after the first checkout (in order to build the `wizard4cloud-commons` library).

> :warning: Please don't commit the ```package.json``` with ``@alien4cloud/wizard4cloud-commons`` dependency (it will make the jenkins build fail). 
> Simply ```mvn clean```before commit your changes.

> :warning: We actually have an issue with the way we manage our angular workspace and the dependency
> between [wizard4cloud-ui](projects/wizard4cloud-ui) and [wizard4cloud-commons](projects/wizard4cloud-commons).
> If you have issues with this :
> - remove ``@alien4cloud/wizard4cloud-commons`` dependency in [package.json](package.json).
> - remove [./dist](./dist) folder.
> - remove [./node_modules](./node_modules) folder.
> - run ```mvn install -DskipTests``` 

### Development server

Run `npm start` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

### Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

### Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

### Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

### Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## Wizard FSM

Have al look to [Application Wizard Module readme](projects/wizard4cloud-ui/src/app/features/application-wizard/readme.md).

## Theming

Some themes are in folder [projects/wizard4cloud-ui/assets/styles/custom-themes]()
They are processed by [tools/build-themes.sh]() to generate css files in [projects/wizard4cloud-ui/assets/styles/built]() folder.

The file [projects/wizard4cloud-ui/assets/styles/_w4c-material-theme.scss]() contains a mixin that take a theme as argument. We should place here all css class definitions that we want to be theme dependant. We should not have css classes with colors out of here.

The file [projects/wizard4cloud-ui/assets/styles/_w4c-static.scss]() should contains css class that are not theme dependant (status colors ...).

## TODO

Le state deployInProgress devrait être un form affichant un spinner (on mettra une progress bar par la suite)
Pour être dans la logique A4C, peut être le renommer activeDeploymentForm

Une fois que le deployment est demandé, il faut requêter ça pour récupérer le deploymentId :

http://localhost:9999/rest/latest/applications/@{applicationId}/environments/@{environmentId}/active-deployment-monitored

Renvoi : alien4cloud.rest.application.model.MonitoredDeploymentDTO

```
{
  "data": {
    "deployment": {
      "id": "d932d042-5e56-45a8-b556-aa7769c39738",
      "orchestratorDeploymentId": "TestMockTplsqdd-Environment",
      "deployerUsername": "admin",
      "sourceType": "APPLICATION",
      "orchestratorId": "35cbe56a-73aa-47ad-a128-7f58236c72a3",
      "locationIds": [
        "89354866-6450-42f6-8dc2-c5a080a6592c"
      ],
      "sourceId": "TestMockTplsqdd",
      "sourceName": "TestMockTplsqdd",
      "environmentId": "4b249fc3-0f0d-4e23-9d08-66e5cd7680ce",
      "versionId": "0.1.0-SNAPSHOT",
      "startDate": 1564477991688,
      "workflowExecutions": {

      }
    },
    "workflowExpectedStepInstanceCount": {
      "cancel": 0,
      "uninstall": 2,
      "stop": 1,
      "install": 3,
      "start": 1,
      "run": 0
    }
  },
  "error": null
}
```

Ensuite, appeler ça en boucle (toutes les secondes, pas plus !) :

http://localhost:9999/rest/latest/workflow_execution/@{deploymentId}

renvoit : WorkflowExecutionDTO

```
{
  "data": {
    "execution": {
      "id": "52ff57f3-b687-400f-a264-7ffbb222ceb5",
      "deploymentId": "d932d042-5e56-45a8-b556-aa7769c39738",
      "workflowId": "install",
      "workflowName": "install",
      "displayWorkflowName": "install",
      "startDate": 1564477994889,
      "status": "RUNNING",
      "hasFailedTasks": false
    },
```

Boucler
tant que execution.status === RUNNING
Dès que execution.status != RUNNING il faut arrêter le spinner et afficher le status
