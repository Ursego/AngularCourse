// https://v2.angular.io/docs/ts/latest/guide/ngmodule.html

// An Angular Module is a class marked by the @NgModule decorator which describes how the application parts fit together.

// A module consolidates components, directives, and pipes into a cohesive blocks of functionality
// 		focused on a feature area, specific application domain, workflow, a closely related set of capabilities or common collection of utilities.

// Modules are a great way to:
// * structure and organize an application for better maintainability, scalability, and efficiency;
// * handle dependencies and services;
// * extend an application with capabilities from external libraries.

// Many Angular libraries are modules (such as FormsModule, HttpModule, and RouterModule).
// Many third-party libraries are available as NgModules (such as Material Design, Ionic, AngularFire2).
	
// ######################################################################################################
// Key Features of Angular Modules:
// ######################################################################################################

// 1. Organization:
// Angular modules allow you to manage and encapsulate components, services, directives, and pipes into a cohesive unit.
// This helps in organizing the code and makes the application easier to manage as it grows.

// 2. Decomposition:
// Large applications can be broken down into smaller, manageable, and more focused modules.
// For instance, you might have a `UserModule` for user-related components and services, and a `ProductModule` for product management features.

// 3. Reusability:
// By encapsulating functionality within modules, you can easily reuse them across different parts of your app or even across different apps.
// This modular architecture promotes reusability and DRY (Don't Repeat Yourself) principles.

// 4. Lazy Loading:
// Modules can be loaded on demand rather than loading all at once when the application starts.
// This technique, known as lazy loading, helps in speeding up the initial load time of the application, as modules are only loaded when needed.

// 5. Providers Scope:
// Services can be provided in Angular modules, which can scope their availability to the module instead.
// For example, if a service is provided in a module that is lazily loaded,
//		a new instance of the service will be created and used by all components within that module.

// ######################################################################################################
// Anatomy of an Angular Module:
// ######################################################################################################

// Here’s a basic example of an Angular module:

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MyComponent } from './my.component';

@NgModule({
  declarations: [
    // An array of all components, directives, and pipes that belong to this module:
    MyComponent 
  ],
  imports: [
    // An array of other Angular modules which are available in the HTML templates of the current module.
    // All exported declarations from the imported modules (components, directives, pipes) become available in HTML.
    // ATTENTION! The "imports" array is only about HTML templates - it has no effect on what you can use in your component classes' TypeScript code.
    // You still need explicit TypeScript import statements.
    CommonModule, // includes common directives like *ngIf, *ngFor
    FormsModule  // is required if you're using template-driven forms
  ],
  providers: [
    // Defines the injectable service providers that components in this module might need.
    // The Angular Injector creates a singleton instance of these services, available to all components in the module.
	  // While providers can be declared in any module, app-wide services are typically declared in the app root module.
  ],
  exports: [
    // An array of the components, directives, and pipes that belong to this module which are available to other modules:
    MyComponent
  ]
})
export class MyModule {}

// ######################################################################################################
// THE ROOT MODULE: AppModule
// ######################################################################################################

// Every Angular application has at least one root module class which tells Angular how to construct the application.
// You bootstrap that module to launch the application.
// The conventional name is AppModule.
// In contrast to feature modules, the root module has the bootstrap property - it identifies the bootstrap component.

// The root module is all you need in a simple application with a few components.
// As the application grows, you refactor the root module into feature modules that represent collections of related functionality.
// You then import these modules into the root module.

// Here is a minimal root module:

// src/app/app.module.ts
import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent }  from './app.component';

@NgModule({
  imports:      [ BrowserModule ],
  declarations: [ AppComponent ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }

// @@@ The "imports" array

// The root module doesn't usually have HTML templates directly, but it still needs to import feature modules in its "imports" array for several important reasons:
// 1. Component Registration: When you import a feature module into AppModule, you're registering all the exported components from that feature module
//            with Angular's component registry. This makes those components available for use anywhere in your app, including:
//    * In the AppComponent's template (the root component)
//    * In router outlet targets when using routing
//    * As entry components for dynamic component creation
// 2. Bootstrapping Process: Angular's bootstrapping process starts with the AppModule. It needs to know about all parts of your application that should be available at startup.
// 3. Dependency Injection Tree: Services provided in feature modules become part of the application's dependency injection tree when those modules are imported into AppModule.

// Every browser app must import BrowserModule which registers critical application service providers.
// It's essential for running your app in a browser and should be imported only once in your entire application, specifically in the `AppModule`.
// Other (non-root) modules typically use `CommonModule` instead of `BrowserModule`.

// @@@ The "declarations" array

// Identifies the application's only component, the root component, the top of the app's rather bare component tree.

// @@@ The "bootstrap" array

// Contains the root component that Angular creates and inserts into the index.html host web page as <app-module></app-module>.

// @@@ How Does Angular Know Which Module is the App Root Module?

// Through the bootstrapping mechanism defined in main.ts. Here’s how it typically looks:
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));

// The platformBrowserDynamic().bootstrapModule(AppModule) call in main.ts explicitly specifies AppModule class as the root module.
// This function call starts the application with AppModule as the entry point,
// 		kicking off the Angular bootstrapping process that loads the initial component specified in the bootstrap array.
// Obviously, the class, passed to platformBrowserDynamic().bootstrapModule(), MUST be in the bootstrap property of the root module.

// @@@ Root-level routing:

// If you're using routing, the root `RouterModule.forRoot()` is declared in the `AppModule`.

import { RouterModule } from '@angular/router';

@NgModule({
 imports: [RouterModule.forRoot(routes)],
 // ...
})
export class AppModule { }

// Other (non-root) modules use `RouterModule.forChild()` if they have routes.

// ######################################################################################################
// The CLI command to create a new module
// ######################################################################################################

ng generate module my-example
ng g m my-example

// The command creates a new module class file `my-example.module.ts` under the root folder of your project (where the `angular.json` file is located), like `src/app`:

src/
└── app/
    └── my-example.module.ts

// The generated module class will look like this:

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
 declarations: [],
 imports: [
   CommonModule
 ]
})
export class MyExampleModule { }

// @@@ Customizing the Location:

// You can specify a location different from the root folder by providing a path:
ng generate module path/to/my-example
ng g m my-example

// If the path is relative (doesn't start with the drive letter), the module folder will be created in the root folder:

src/
└── app/
    └── my-example/
        └── my-example.module.ts

// @@@ --routing
// Adds a routing module.
// Use the `--routing` flag if you want to create a module with its own routing configuration For example:
ng g m my-example --routing

// After creating a module, you might want to generate components within that module using the `--module` parameter:
ng g c my-example/my-component --module=my-example
// But this is already the topic of the next file of our course.

// Remember, you can always run `ng generate module --help` to see all available options for this command.