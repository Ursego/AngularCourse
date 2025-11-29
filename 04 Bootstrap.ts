// Angular bootstrapping is the process of initializing and starting an Angular application.
// It begins with the main.ts file, which serves as the entry point for the application.

// Here’s how the bootstrapping process works in Angular:

// ######################################################################################################
// main.ts
// ######################################################################################################

// The main.ts file is where you configure and launch your Angular application.
// This file is crucial as it sets up the environment that your application runs on,
//    and kicks off the root module, which is usually AppModule.

// main.ts file is typically located in the src folder of an Angular project. Here's an overview of how it works:

import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
    enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));

// Explanation:

// environment.production:
//    The if block checks if the application is in production mode ().
// enableProdMode():
// 		Function that disables Angular's development mode.
// 		It turns off development-specific features like assertions and change detection checks to improve performance.
// platformBrowserDynamic():
// 		Function that provides tools necessary for client-side applications to bootstrap the app.
// 		This function creates an instance of the Angular platform for the browser.
// AppModule:
// 		The root module of your application, defined in app.module.ts.
// 		This module sets up the initial view and provides the configured runtime compiler.
// platformBrowserDynamic().bootstrapModule(AppModule):
// 		This line bootstraps the root AppModule.
// 		Bootstrapping in this context means loading the Angular module to start the application, i,e,
// 			rendering of the Angular application in the client's browser.
//    This initiates the bootstrapping process, which includes:
//      - Loading and configuring the root module
//      - Creating an instance of the root component
//      - Inserting the root component into the DOM
// 		The platformBrowserDynamic function provides methods for executing the app in a browser with JIT compilation,
// 		enabling the application to compile dynamically in the client-side environment.
// .catch(err => console.error(err)):
// 		This is a catch block to handle and log errors that occur during the application bootstrap process.

// ######################################################################################################
// index.html
// ######################################################################################################

// Serves as the main HTML page for your Angular application and typically contains a minimal HTML structure.

// In the index.html file, you'll find a custom HTML tag that represents your root component.
// By convention, this is often <app-root>, but it can be named differently based on your root component's selector.

// The bootstrapping process connects the Angular application to the index.html file,
// typically by replacing the <app-root> tag with the rendered root component.

// Here’s what you usually find in a standard Angular project's main.ts file:

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>My Angular App</title>
  <base href="/">
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>
  <app-root></app-root>
</body>
</html>

// In your TypeScript code (usually app.component.ts), the root component is defined with a selector that matches the tag in index.html:

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  // component logic
}

// When the application bootstraps:
// - Angular creates an instance of the root component (AppComponent).
// - It compiles the component's template and styles.
// - It then replaces the <app-root> tag in index.html with the fully rendered component.

// From this point, the root component can render child components, which in turn can render their own child components,
// 	  forming the application's component tree.

// As the application runs, Angular continues to update the DOM based on component state changes, user interactions, and data updates,
// 	  all starting from this initial connection point.

// This process allows Angular to take control of a specific part of the HTML document (defined by the root component's tag)
// 	  and manage it as a dynamic, interactive application, while leaving the rest of the index.html file intact.
	
// ######################################################################################################
// package.json
// ######################################################################################################

// package.json is a crucial file in Angular projects, as it is in most Node.js-based applications. It serves several important purposes:
// 1. Project metadata: It contains basic information about the project such as name, version, description, and author.
// 2. Dependency management: It lists all the project dependencies and their versions, both for production and development.
// 3. Scripts definition: It defines various npm scripts that can be used to run, build, test, and manage the project.
// 4. Configuration: It can include configuration settings for various tools used in the project.

// Here's an example of a typical package.json file for an Angular project:

{
  "name": "my-angular-app",
  "version": "0.0.0",
  "scripts": {
    "ng": "ng",
    "start": "ng serve",
    "build": "ng build",
    "watch": "ng build --watch --configuration development",
    "test": "ng test"
  },
  "private": true,
  "dependencies": {
    "@angular/animations": "^15.2.0",
    "@angular/common": "^15.2.0",
    "@angular/compiler": "^15.2.0",
    "@angular/core": "^15.2.0",
    "@angular/forms": "^15.2.0",
    "@angular/platform-browser": "^15.2.0",
    "@angular/platform-browser-dynamic": "^15.2.0",
    "@angular/router": "^15.2.0",
    "rxjs": "~7.8.0",
    "tslib": "^2.3.0",
    "zone.js": "~0.12.0"
  },
  "devDependencies": {
    "@angular-devkit/build-angular": "^15.2.4",
    "@angular/cli": "~15.2.4",
    "@angular/compiler-cli": "^15.2.0",
    "@types/jasmine": "~4.3.0",
    "jasmine-core": "~4.5.0",
    "karma": "~6.4.0",
    "karma-chrome-launcher": "~3.1.0",
    "karma-coverage": "~2.2.0",
    "karma-jasmine": "~5.1.0",
    "karma-jasmine-html-reporter": "~2.0.0",
    "typescript": "~4.9.4"
  }
}

// This file includes:

// 1. Project name and version
// 2. Scripts for various tasks (start, build, test, etc.).
// 3. Dependencies required for running the application
// 4. DevDependencies required for development and testing

// @@@ Explanation of each property in the "scripts" section:

// These scripts define various commands that can be run using npm or yarn.

"scripts": {
  "ng": "ng",
  "start": "ng serve",
  "build": "ng build",
  "watch": "ng build --watch --configuration development",
  "test": "ng test"
}

// "ng": "ng"
   // This script allows you to run Angular CLI commands directly.
   // For example, you can use npm run ng generate component instead of having Angular CLI installed globally.

// "start": "ng serve"
//    This script starts a development server.
//    When you run npm start, it will compile your application and serve it locally, usually at http://localhost:4200
//    It also enables live reloading, so changes to your code will automatically refresh the browser.
//    This script is executed so often during development that, in some projects, it is called "s" instead of "start", so developers can type npm s.

// "build": "ng build"
//    This script builds your application for production.
//    It compiles your TS code, bundles your files, minifies them, and creates an output directory (usually dist/) with deployment-ready files.

// "watch": "ng build --watch --configuration development"
//    This script builds your application and watches for changes. Unlike "start", it doesn't serve the application.
//    The --configuration development flag uses development-specific settings defined in your angular.json file.

// "test": "ng test"
//    This script runs your unit tests using Karma and Jasmine. It will open a browser window to execute the tests and show the results.

// You can also add custom scripts to this section for other tasks specific to your project.
// For instance, you might add a script for linting, deploying, or any other repetitive task in your development workflow.