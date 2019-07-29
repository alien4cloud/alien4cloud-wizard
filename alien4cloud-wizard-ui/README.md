# Alien4Cloud Wizard

## How-to use

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.0.3.

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

Have al look to [Application Wizard Module readme](src/main/webapp/app/features/application-wizard/readme.md).

## Theming

Some themes are in folder [src/main/webapp/assets/styles/custom-themes]()
They are processed by [tools/build-themes.sh]() to generate css files in [src/main/webapp/assets/styles/built]() folder.

The file [src/main/webapp/assets/styles/_w4c-material-theme.scss]() contains a mixin that take a theme as argument. We should place here all css class definitions that we want to be theme dependant. We should not have css classes with colors out of here.

The file [src/main/webapp/assets/styles/_w4c-static.scss]() should contains css class that are not theme dependant (status colors ...).
