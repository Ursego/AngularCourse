// Routing and navigation are fundamental concepts in Angular that allow you to create single-page applications (SPAs) with multiple views.
// They enable users to navigate between different components without reloading the entire page, providing a smooth and responsive user experience. 

// ######################################################################################################
// Basic Routing Concepts:
// ######################################################################################################

// a) Routes: These are URLs that map to components in your application.
// b) Router: A module that handles navigation between views.
// c) RouterOutlet: A placeholder in your template where Angular displays the content of each route.
// d) RouterLink: A directive for creating navigation links.

// ######################################################################################################
// The Route class and Routes array
// ######################################################################################################

// Route is a configuration object that defines how navigation should be handled in an application.
// A set of routes are collected in a Routes array to define a Router configuration.
// The Router attempts to match segments of a given URL against each route, using the configuration options defined in this object.

// Each route in this array maps a URL path to a component or to other Routing configurations,
// 		such as child routes, lazy-loaded routes, or even a redirection rule.
// The Routes array is essential for setting up the navigation structure of an Angular application.

// Each route in the Routes array can include several properties:
// * path: Specifies the URL path for the route.
// * component: Associates a component with the route, which will be displayed when the route is activated.
// * redirectTo: Provides a path to redirect to if this route is matched.
// * pathMatch: Specifies how the router should match the URL path to the route:
//		'full' - The entire URL must match the path exactly. Ensures that redirection happens only when there is no additional path info in the URL.
//		'prefix' (default) - Match if the path is the initial segment of the URL.
//			  The route will activate if the path is a prefix of the URL.
//			  Useful to define paths that act as a base for child routes or when you want a route to match any URL that starts with a specific pattern.
// * children: Defines child routes.
// * resolve: Defines data resolver classes that fetch data before the route is activated.
// * canActivate: Uses guard services to control access to a route.
// * canLoad: Controls whether a module can be lazy-loaded.

// ######################################################################################################
// Setting up Routing:
// ######################################################################################################

// First, define the routes in a module typically called AppRoutingModule and placed in app-routing.module.ts:

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { HomeComponent } from './home.component';
import { AboutComponent } from './about.component';
import { ContactComponent } from './contact.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  
  // Empty path means that the base URL is entered. Obviously, we want to redirect to the home page in this situation.
  // 'full' ensures that the redirection happens only when the full path (like mysite.com), not only the URL's beginning, is an exact match:
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  
  // '**' is a wildcard route that catches any URL that doesn’t match previously defined routes, typically used for displaying a 404 error page
  // It must be listed last!
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes)
  ],
  declarations: [AppComponent, HomeComponent, AboutComponent, ContactComponent],
  bootstrap: [AppComponent]
})
export class AppRoutingModule { }

// In your application’s main component template, usually app.component.html, add a <router-outlet> tag.
// This acts as a placeholder where the router renders the component based on the active route:

<nav>
  <a routerLink="/home" routerLinkActive="active">Home</a>
  <a routerLink="/about" routerLinkActive="active">About</a>
  <a routerLink="/contact" routerLinkActive="active">Contact</a>
</nav>

<router-outlet></router-outlet>

// The <nav> tag is an HTML5 semantic element used to define a section of a webpage that contains navigation links.
// It's specifically designed to group together a set of major navigational elements on a website.
// While it's not mandatory to use the <nav> tag for navigation links (you could use a <div> instead),
//    using <nav> is considered a best practice for creating semantic, accessible HTML structure.

// ######################################################################################################
// The [routerLink] directive
// ######################################################################################################

// Creates links to different routes or views within your Angular app without causing a full page reload.
// Is typically used as an attribute on HTML elements, such as <a> and <button>, to create navigation links:

<a [routerLink]="...">...</a>

// When applied to an element in a template, makes that element a link that initiates navigation to a route.
// Navigation opens one or more routed components in one or more <router-outlet> locations on the page.
// It's a key feature in Angular for creating navigation links in your application.

// Declared in the RouterLink class (https://angular.dev/api/router/RouterLink#routerLink), which is imported from the @angular/router package.
// Specifically, routerLink is a directive that's exported by the RouterModule.

// You can also use routerLink with dynamic values:
<a [routerLink]="['/user', userId]">User Profile</a>

// Let's say we have a component with a list of users:
@Component({
  selector: 'app-user-list',
  template: `
    <h2>User List</h2>
    <ul>
      <li *ngFor="let user of users">
        <a [routerLink]="['/user', user.id]">{{ user.name }}</a>
      </li>
    </ul>
  `
})
export class UserListComponent {
  users = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
    { id: 3, name: 'Charlie' }
  ];
}

// For these links to work, you need to set up corresponding routes in your routing module:
const routes: Routes = [
  ...
  { path: 'user/:id', component: UserDetailComponent },
  ...
];

// In this example:
// * We're using *ngFor to iterate over a list of users.
// * For each user, we create a link using [routerLink].
// * !!! The [routerLink] is set to an array where the first element is the base path ('/user') and the second is the user's id.
// * Clicking on "Alice" would navigate to '/user/1', "Bob" to '/user/2', and so on.

// The rendered HTML would look like this:
<ul>
  <li>
    <a href="/user/1">Alice</a>
  </li>
  <li>
    <a href="/user/2">Bob</a>
  </li>
  <li>
    <a href="/user/3">Charlie</a>
  </li>
</ul>

// Key points about this rendering:

// * The *ngFor directive creates a new <li> element for each user in the users array.
// * Inside each <li>, an <a> element is created.
// * The [routerLink] attribute is processed by Angular's router. In the actual DOM, it will appear as a normal href attribute.
// * !!! The ['/user', user.id] array is converted into a URL path.
//		The first element ('/user') is the base path, and the second element (user.id) is appended to it.
// * The content of each <a> tag is the user's name, rendered by the {{ user.name }} expression.

// ######################################################################################################
// Route Parameters:
// ######################################################################################################

// You can pass parameters to routes for dynamic content:

const routes: Routes = [
  { path: 'user/:id', component: UserDetailComponent }
];
// If 'user' is attached to the base URL, the UserDetailComponent componend will be invoked, and the value of :id will be passed to it.

// In the UserDetailComponent:

import { ActivatedRoute } from '@angular/router';

export class UserDetailComponent implements OnInit {
  userId: string;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      if (params['id']) {
        this.userId = params['id']; // the value of :id is passed to it
        // Do something with the userId, like fetching user data
      } else {
        // Always handle the case where no ID is provided! Perhaps redirect or show an error.
      }
    })
}

// A sample URL with the id parameter would look like this:
http://www.example.com/user/123
// user/ matches the static part of the route path.
// 123 is the value of the :id parameter.

// this.route.params.subscribe is a method used in Angular components to subscribe to route parameter changes.
// this.route refers to an instance of ActivatedRoute, which is typically injected into the component's constructor.
// params is an Observable (you will learn oabout them soon) on the ActivatedRoute that emits new values when the route parameters change.
// subscribe is a method on this Observable that allows you to react to these changes.

// In the above example, whenever the route parameter 'id' changes, the subscribe callback will be called with the new parameters.
// This allows your component to react to route changes, such as loading new data based on the updated route parameters.

// The signature of this.route.params.subscribe function is as follows:
subscribe(
  next?: (value: Params) => void,
  error?: (error: any) => void,
  complete?: () => void
): Subscription
// The parameters:
//     next
//        A function that receives the emitted value (in this case, the route parameters).
//     error
//        An optional function that handles any errors in the Observable.
//     complete
//        An optional function that is called when the Observable completes
//        (which doesn't typically happen for route params unless you explicitly complete it).
// The function returns a Subscription object.

// The Params interface is defined in the @angular/router package and is used to represent the parameters of a route.
// It's essentially a key-value pair type where keys are strings and values can be strings or arrays of strings:
interface Params {
  [key: string]: string | string[];
}
// It's used to represent both route parameters and query parameters.
// Route parameters: '/user/:id' might result in { id: '123' }
// Query parameters: '/search?q=angular&type=framework' might result in { q: 'angular', type: 'framework' }

// You can access values using standard object notation:
const id = params['id'];
const id = params.id; // the same

// If a parameter can have multiple values, it will be an array.
// For a URL like '/items?category=book&category=electronics':
const categories = params['category']; // ['book', 'electronics']

// When using Params, TypeScript will ensure type safety. However, you might need to check if a parameter exists before using it:
if (params['id']) {
  const id = params['id'];
  // Use id
}

// Angular also provides a ParamMap interface, which is similar to Params but has additional methods like get(), getAll(), and has().
// You can access it via this.route.paramMap.

// It's important to note that you should unsubscribe from this Observable when the component is destroyed to prevent memory leaks,
// typically in the ngOnDestroy lifecycle hook (you will learn that topic later).

// ######################################################################################################
// Child Routes:
// ######################################################################################################

// You can create hierarchical route structures using the 'children' property of the Route interface:
interface Route {
	// ... other properties ...
	children?: Routes;
	// ... other properties ...
}

// Here's an example of Child Routes with a sample component and URL:

// ElectronicsComponent:

@Component({
  selector: 'app-electronics',
  template: `
    <h2>Electronics</h2>
    <ul>
      <li>Smartphone</li>
      <li>Laptop</li>
      <li>Tablet</li>
    </ul>
  `
})
export class ElectronicsComponent { }

// BooksComponent:

@Component({
  selector: 'app-books',
  template: `
    <h2>Books</h2>
    <ul>
      <li>Harry Potter and Angular TypeScript</li>
      <li>The Catcher in the Rye</li>
      <li>1984</li>
    </ul>
  `
})
export class BooksComponent { }

// ProductsComponent:

// Serves as a container (parent component) for the child routes.
// It includes navigation links to the child routes and a <router-outlet> where the child components
// (ElectronicsComponent or BooksComponent) will be rendered.

@Component({
  selector: 'app-products',
  template: `
    <h1>Products</h1>
    <nav>
      <a routerLink="electronics">Electronics</a> |
      <a routerLink="books">Books</a>
    </nav>
    <router-outlet></router-outlet>
  `
})
export class ProductsComponent { }
// Notice that the relation between the routerLink's ("electronics" & "books") and the componets to render in <router-outlet>
// (ElectronicsComponent & BooksComponent) is defined not here but in the 'children' property in an element of the routes array.

// AppRoutingModule:

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ElectronicsComponent } from './products/electronics/electronics.component';
import { BooksComponent } from './products/books/books.component';
import { ProductsComponent } from './products/products.component';

// Step A: create the routes constant:

const routes: Routes = [
  { 
    path: 'products', 
    component: ProductsComponent,
	  // The children property of the Route interface is of the type Routes -
	  // an array of child Route objects that specifies a nested route configuration:
    children: [
      { path: 'electronics', component: ElectronicsComponent },
      { path: 'books', component: BooksComponent }
    ]
  }
];

// Step B: create the module which consumes the routes constant:

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

// When a user navigates to /products/electronics, they would see the ProductsComponent with the ElectronicsComponent nested inside it.
// Similarly, /products/books would show the ProductsComponent with the BooksComponent nested inside.

// This AppRoutingModule is typically created in a file named app-routing.module.ts in the src/app folder of an Angular project.
// It's a convention to have a separate routing module for organizing the application's routes.
// To use this module, you would import it in your main AppModule (usually in app.module.ts):
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  imports: [
    // ... other imports ...
    AppRoutingModule
  ],
  // ... other module metadata ...
})
export class AppModule { }

// This structure allows for a clean separation of routing concerns from the main application module.

// ######################################################################################################
// Navigating programmatically
// ######################################################################################################

// You can navigate in code (rather than through user interaction with links) using the navigate() method of the Router class:

import { Router } from '@angular/router';

export class MyComponent {
  constructor(private router: Router) {}

  goToUserDetail(id: string) {
    this.router.navigate(['/user', id]);
  }
}
// For example, if id is 123, the URL to navigate to will be /user/123.

// The method's signature in the Router class:
navigate(commands: any[], extras: NavigationExtras = { skipLocationChange: false }): Promise<boolean>

// @@@ The 'commands' argument

// An array of URL fragments (hardcoded or variables) with which to construct the target URL.
// If the path is static, can be the literal URL string.
// The array elements are joined with '/' in the order they appear.

// You can mix static segments with variables to create complex routes programmatically.
// Variable elements (like `id` in the example below) are converted to strings and inserted into the path.
// Any undefined or null elements are ignored.

// If the first element of the commands array starts with a slash ('/'), it treats the path as absolute.
// Otherwise, it's relative to the current route URL or the one provided in the relativeTo property of the extras object, if supplied.

// Examples:
this.router.navigate['products', 'electronics'] // result: '/products/electronics'
this.router.navigate['/user', id] // result: '/user/123' if `id` is 123
this.router.navigate['/user', username, 'posts', postId] // result: '/user/john/posts/456'
this.router.navigate['/', 'home'] // result: '/home'
this.router.navigate[''] // result: '', i.e. it's the final URL is the base URL only

// @@@ The 'extras' argument (optional)

// An object of type NavigationExtras containing additional navigation options.
// The NavigationExtras interface is described here: https://v17.angular.io/api/router/NavigationExtras
// It has many properties but we will review only three which are especially important - relativeTo, queryParams and replaceUrl.

// relativeTo (of type ActivatedRoute: https://v17.angular.io/api/router/ActivatedRoute):
// Specifies the base ActivatedRoute from which the navigation should occur. 
// Allows you to create relative navigation paths, which can be particularly useful in nested routing scenarios.
// Useful for navigating to sibling or child routes without needing to know the full path:
this.router.navigate(['../sibling'], { relativeTo: this.route }); // assuming current route is '/parent/child'
// If relativeTo is NOT provided, the navigation is treated as absolute and starts from the root of your application's routing configuration:
this.router.navigate(['/parent/sibling']); // regardless of current route

// queryParams (of type Params: https://v17.angular.io/api/router/Params):
// Sets query parameters to the URL.

// replaceUrl (of type boolean):
// Affects how the navigation is recorded in the browser's history.
// Determines whether the new URL should replace the current URL in the browser's history (true) or be added as a new entry (false).
// The default behavior (when replaceUrl is not specified or set to false):
// * The new URL is pushed onto the browser's history stack.
// * This creates a new history entry, allowing the user to navigate back to the previous URL using the browser's back button.
// The behavior when replaceUrl is set to true:
// * The new URL replaces the current URL in the browser's history - no new history entry is created.
// * The user can't navigate back to the previous URL using the browser's back button.
// Common use cases when you would want replaceUrl to be true:
// * Login/logout flows: Replace the login page URL with the dashboard URL after successful login.
// * Wizard or multi-step forms: Replace intermediate steps in the history.
// * Redirects: When you want to redirect without adding an entry to the browser history.

// Example:
this.router.navigate(['path'], {
	relativeTo: this.route,
	queryParams: { firstName: 'John', lastName: 'Johnson' },
	replaceUrl: true
});

// ######################################################################################################
// Route Guards:
// ######################################################################################################

// Route guards protect routes and control access. There are several types:

// a) CanActivate: Controls if a route can be activated
// b) CanActivateChild: Controls if child routes of a route can be activated
// c) CanDeactivate: Controls if a user can leave a route
// d) Resolve: Performs route data retrieval before route activation
// e) CanLoad: Controls if a module can be loaded lazily

// Example of CanActivate guard:

import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    if (this.authService.isLoggedIn()) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}

// Then use it in your routes:

const routes: Routes = [
  { path: 'admin', component: AdminComponent, canActivate: [AuthGuard] }
];

// ######################################################################################################
// Lazy Loading:
// ######################################################################################################

// Lazy loading helps to load modules only when they're needed, improving initial load time.
// It helps in organizing the codebase by separating features into distinct modules, which can be developed and maintained independently.

// loadChildren is a property used to enable lazy loading of feature modules.
// It allows you to load a module and its associated routes only when a specific route is activated.
// Since Angular 8, the recommended way to configure loadChildren is by using the dynamic import() syntax.
// This method creates a separate JavaScript bundle for the lazy-loaded module, which is fetched only when the route is accessed.

// The feature routing module (`products-routing.module.ts`):

const routes: Routes = [
  {
    path: '',
    component: ProductsComponent,
    children: [
      { path: 'electronics', component: ElectronicsComponent },
      { path: 'books', component: BooksComponent }
    ]
  }
];

// The main routing module (e.g., `app-routing.module.ts`):

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  { 
	// The path specifies the URL segment that will trigger the lazy loading of the module:
    path: 'products',
	// The loadChildren property uses a function that returns a promise from the dynamic import() statement.
	// This promise resolves to the module class, allowing Angular to load the module only when needed:
    loadChildren: () => import('./products/products.module').then(m => m.ProductsModule)
  }
];

// The `loadChildren` property in the main routing module is what actually performs the lazy loading.
// It uses a dynamic import to load the ProductsModule only when the 'products' route is accessed.

// Considerations:
// Each lazy-loaded module should have its own routing configuration.
// Lazy-loaded modules should not be imported directly in other modules to maintain the lazy loading benefit.

// ######################################################################################################
// Route Events:
// ######################################################################################################

// You can subscribe to router events to perform actions during navigation:

import { Router, NavigationStart, NavigationEnd } from '@angular/router';

export class AppComponent {
  constructor(private router: Router) {
    router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        // Show loading indicator
      } else if (event instanceof NavigationEnd) {
        // Hide loading indicator
      }
    });
  }
}

// ######################################################################################################
// Route Resolvers:
// ######################################################################################################

// Resolvers allow you to fetch data before activating a route:

import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class UserResolver implements Resolve<User> {
  constructor(private userService: UserService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<User> {
    const id = route.paramMap.get('id');
    return this.userService.getUser(id);
  }
}

// Use it in your routes:

const routes: Routes = [
  { path: 'user/:id', component: UserDetailComponent, resolve: { user: UserResolver } }
];

// Then in your component:

export class UserDetailComponent implements OnInit {
  user: User;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.data.subscribe((data: { user: User }) => {
      this.user = data.user;
    });
  }
}

// A resolver is a service that implements the `Resolve<T>` interface from Angular's router package.
// It is used to resolve data for a route before the route is activated (to fetch necessary data before navigating to a route)
// This ensures that all the required data for a view is preloaded, providing a smoother user experience
// because the data is already available when the component loads.
// This is particularly useful in applications where you want to ensure that components do not render with partial data.

// How Route Resolvers Work:

// 1. Define a Resolver Service:
//       Create a service that implements the `Resolve` interface.
//       This service fetches data asynchronously and returns it, usually from a backend API.
// 2. Register the Resolver with a Route:
//       Associate the resolver with a specific route in your routing configuration.
//       When the route is activated, Angular will first execute the resolver, wait for it to complete, and then proceed to activate the route.
// 3. Access Resolved Data:
//       The resolved data is then available as part of the route's `ActivatedRoute` data,
//       making it accessible to the component that is loaded by the route.

// Example of a Route Resolver:

// user.resolver.ts
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class UserResolver implements Resolve<any> {
  constructor(private userService: UserService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    let userId = route.paramMap.get('id');
    return this.userService.getUserById(userId);
  }
}
 
// app-routing.module.ts
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserDetailsComponent } from './user-details/user-details.component';
import { UserResolver } from './user.resolver';

const routes: Routes = [
  {
    path: 'user/:id',
    component: UserDetailsComponent,
    resolve: {
      userData: UserResolver
    }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
 
// user-details.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-details',
  template: `...`
})
export class UserDetailsComponent implements OnInit {
  user: any;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.user = data.userData;
    });
  }
}

// Considerations:
// * Since the resolver delays route activation, it's a good idea to implement global or local loading indicators.
// * Implement robust error handling in resolvers to manage scenarios where data fetching fails, possibly redirecting users or showing error messages.
// * For some applications, using a resolver might delay the navigation perceptibly, especially if the data fetching takes significant time.
//      It's essential to balance the need for preloaded data with the responsiveness of your application.