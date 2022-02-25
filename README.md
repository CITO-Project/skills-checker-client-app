# SkillChecker

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.1.2.

## Configuration

All configuration for the Skills Checker Tool can be found in the [environments](./src/environments) folder. There is a separate configuration file for each localised version of the tool (English, Norwegian, Maltese and Maltese-English). This allows features of the tool to be configured for each locale, for example Google Analytics, Read Speaker functionality, etc. Importantly the host for the REST API that provides data to the Skills Checker Tool can also be configured.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files. Running this command will serve the version of the Skills Checker Tool localised to English. To work with the Norwegian, Maltese or Maltese-English versions use the following:

`ng serve --configuration=no`

`ng serve --configuration=mt`

`ng serve --configuration=en-mt`

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

To build the localised versions of the Skills Checker Tool for Norwegian, Maltese or Maltese-English:

`ng build --configuration=no`

`ng build --configuration=mt`

`ng build --configuration=en-mt`

The full set of build parameters looks like this:

`ng build --configuration=production,mt --aot --build-optimizer --delete-output-path --optimization`

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
