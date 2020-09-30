# Wizard4cloudCommons

This library was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.1.3.

It provides :
- common services to interact with an alien4cloud webapp.
- layout components (header, footer ...).
- commons styles.
- shared components (popup dialog).

It's obviously used by the main Wizard application [wizard4cloud-ui](../wizard4cloud-ui) and can be used by any Wizard addon project.
You can have a look to [alien4cloud-plugin-sample-addon](https://github.com/alien4cloud/alien4cloud-plugin-sample/blob/3.0.x/alien4cloud-plugin-sample-addon/README.md)
if you want to write your own Wizard addon using this library.

## Code scaffolding

Run `ng generate component component-name --project wizard4cloud-commons` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module --project wizard4cloud-commons`.
> Note: Don't forget to add `--project wizard4cloud-commons` or else it will be added to the default project in your `angular.json` file. 

## Build

Run `ng build wizard4cloud-commons` to build the project. The build artifacts will be stored in the `dist/` directory.

## Publishing

The library is published on [npm](https://www.npmjs.com/package/@alien4cloud/wizard4cloud-commons). 
You may re-publish it if it has been improved (then version must be increased in [package.json](./package.json)).

After building your library with `ng build wizard4cloud-commons`, go to the dist folder `cd dist/wizard4cloud-commons` and run `npm publish`.

```
ng build wizard4cloud-commons
cd dist/wizard4cloud-commons/ && npm pack && npm publish
```

## Running unit tests

Run `ng test wizard4cloud-commons` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
