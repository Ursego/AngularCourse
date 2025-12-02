// https://NgRX.io/

// ######################################################################################################
// What is NgRX?
// ######################################################################################################

// NgRX (Angular Reactive Extensions) is a framework for building reactive applications in Angular.
// It's a state management library that implements the Redux pattern using RxJS (Reactive Extensions for JavaScript)
//    to manage the application state in a reactive and predictable way.
// NgRX provides a set of libraries for managing the global state, side effects, and entity collections, among other functionalities.
// It's particularly useful in large-scale applications where managing state in an efficient, predictable, centralized, scalable and maintainable way is critical.

// CONTENTS (to jump to a section, copy it with the asterisk, like "* Reducer" -> Ctrl+F -> Ctrl+V):

// * Model
// * State
// * Store
// * Action
// * Service
// * Effect
// * Reducer
// * The Action's life cycle

// ######################################################################################################
// * Model
// ######################################################################################################

// The Model file declares the data types which represent the module's entities, ensuring strong typing.
// These types define the data structures that will be managed by the NgRX State (will be described soon). Example:

export interface ICustomer {
  customerId: number;
  firstName: string;
  lastName: string;
  orders: IOrder[];
  updatedBy string;
  updatedAt Date;
}

export interface IOrder {
  orderId: number;
  orderDate: Date;
  products: IProduct[];
  updatedBy string;
  updatedAt Date;
}

export interface IProduct {
  productId: number;
  productName: string;
  price: number;
  quantity: number; // quantity of the product in the order
  updatedBy string;
  updatedAt Date;
}

// ######################################################################################################
// * State
// ######################################################################################################

// At high level, an application is a collection of modules.
// Each module normally represents a single domain/area and includes a screen (and dependent popup screens, if any).
// State refers to a singleton object that holds all the data of a single module as it is at the current moment (i.e. the current state of the module).

// A module usually consists of a few components:

// - The parent, module-level component - the top-level container, i.e. the visual "skeleton" of the main screen of the domain.
//      Its HTML template defines the general outline of the screen and where each child component is located (using the child components' selector tags).
//      Here you can see the HTML of a real parent component I developed - it contains some screen areas, buttons and a Tab control, but not its own data fields:
//      https://github.com/Ursego/AngularTypeScriptCSharpCodeExamples/blob/main/4%20Angular/data-chg-sub/data-chg-sub.component.html

// - Child components to render different areas of the main screen.
//      For example, in the just mentioned real parent component you can see this line:
        <app-data-chg-sub-card [contextDataChgSub]="contextDataChgSub"></app-data-chg-sub-card>
//      The app-data-chg-sub-card selector identifies the component defined in
//      https://github.com/Ursego/AngularTypeScriptCSharpCodeExamples/blob/main/4%20Angular/data-chg-sub/data-chg-sub-card/data-chg-sub-card.component.ts
//      So, the following HTML will be rendered on the selector's place:
//      https://github.com/Ursego/AngularTypeScriptCSharpCodeExamples/blob/main/4%20Angular/data-chg-sub/data-chg-sub-card/data-chg-sub-card.component.html
//      Note using the word Card. It is in Angular slang what Form is in other frameworks (i.e. a group of related fields retrieved and submitted together).
//      BTW, that real parent component contains 5 child components located in different areas of the screen, some of whem - on tabs of a Tab control.
//      You can find them by fearching for "<app-data-".

// - Components for dependent screens opened from the main screen. They can be opened by either the parent or a child component.
//      Note that we don't call them child components - they are the top-level components of their own screens (since there are no other components there).

// Each component has a dedicated data structure in the State of the module it belongs to.

// As an example, let's consider a Customer module. That screen is extremely unrealistic, but its entities are convenient for explaining the concept.

// CustomerComponent is the high-level container. It has the following visual structure:
// * On the left side - a narrow vertical panel which is displayed always. It includes:
//    ** A customer search widget (CustomerSearchComponent) with input fields to search by, and a Search button.
//    ** A list of customers (CustomerListComponent) found by the entered search criteria.
// * When the user selects a customer in that list, the main part of the screen displays info for the selected customer:
//      ** The customer details card (CustomerCardComponent).
//      ** A list of the customer's orders (OrderListComponent).
// * When the user clicks an order, the screen displays info for the selected order:
//      ** The order details card (OrderCardComponent).
//      ** A list of the products included in the order (ProductListComponent).
//            When the user double-clicks a product in the list, a details card dialog pops up (ProductCardComponent).

// Each entity has the CRUD functionality.

// Notice the naming convention:
// - List components: <Entity>ListComponent.
// - Card components: <Entity>CardComponent.
// - Other types have neither "List" nor "Card" in their names: CustomerComponent, CustomerSearchComponent.

// Here is the datatype (model) for the State which describes the entire screen's data (ICustomerState):

import { ICustomer, IOrder, IProduct } from 'src/models/customer.model';

export interface ICustomerState {
  customerList: ICustomer[]; // list of customers
  customerListLoaded: boolean; // when false, display a progress bar in place of the data fields
  contextCustomer: ICustomer | null; // details form for the currently selected customer
  contextCustomerLoaded: boolean;

  orderList: IOrder[]; // list of orders of the currently selected customer
  orderListLoaded: boolean;
  contextOrder: IOrder | null; // details form for the currently selected order
  contextOrderLoaded: boolean;

  productList: IProduct[]; // list of products of the currently selected order
  productListLoaded: boolean;
  contextProduct: IProduct | null; // details form dialog for the double-clicked product
  contextProductLoaded: boolean;
}

// As you see, the State doesn't hold references to component instances - it only contains their data.  
// When components are created, they work with this data only.

// Component classes may have properties for the same fields, but these are just temporary storage to facilitate local data manipulations within the Components.
// The usual workflow:
// 1. A value is copied from the state to a property of the component class (and automatically rendered in the HTML if it has a linked control).
// 2. That local copy of the data is processed in the component (either by user interaction or programmatically).
// 3. The changed value is saved in the state which makes the change permanent.
//      The component can change the state directly by dispatching an Action, but it's not a common scenario.
//      Usually, the component dispatches an Action which saves data in the DB by calling a web service.
//      After that, the respective SuccessAction updates the State with the change.
//      Now all three the copies of the value - in the DB, in the State and in the component class - are in sync.

// State:
// * Centralizes data management providing a single source of truth for the module's data.
// * Ensures that all parts of the module are synchronized with the same version of the data.
// * Simplifies communication between components by avoiding direct data sharing and, worse, multiple local copies of the same data.
// * Ensures that growing amounts of data are handled efficiently and predictably.

// In NgRX, State is immutable, meaning it cannot be directly modified.
// Eeach change creates a new instance of State and makes the old instance a subject to the garbage collector.
// That prevents accidental modifications and ensures predictability and reliable debugging.

// @@@ The Initial State:

// In addition to declaring the State type (ICustomerState), you must also create the Initial State object of that type, with all the fields having default values:
export const initialCustomerState: ICustomerState = {
  // Customer:
  customerList: [],
  customerListLoaded: false,
  contextCustomer: null,
  contextCustomerLoaded: false,
  // Order:
  orderList: [],
  orderListLoaded: false,
  contextOrder: null,
  contextOrderLoaded: false,
  // Product:
  productList: [],
  productListLoaded: false,
  contextProduct: null,
  contextProductLoaded: false
};
// This object is usually created in same Model file which declares the State's data type.
// If the State's data type is changed later, it's convenient to synchronize the Initial State since it's right there at hand.

// The Initial State is crucial since it:
// * Provides a clear and consistent starting point for the module's State.
// * Ensures that the state is always defined, even before any data is retrieved.

// Later, when you learn about Reducers, you will see that the initialCustomerState object is passed to the createReducer function.

// ######################################################################################################
// * Store
// ######################################################################################################

// While State is a module-level container, Store is an application-level container (in fact, a container of containers).
// The Store instance is a singleton object that holds the States of multiple modules combined, which makes up the state of the whole application.

// The Store is the "single source of truth" for the application state/data.
// This simply means that our application state has only one global, centralized source.

// The Store provides a way to access the states of different modules, dispatch Actions, and subscribe to state changes.
// You can think of it as a database that you can get access in order to retrieve or update the data that the application operates on.

// The Store is an Observable, and components can subscribe to it to get updates when the state changes.
// Usually, componens select data from the Store using Observables, so if one component changes the State, others immediately see that change.

// You don't declare the Store data type, and don't instantiate it - Angular does all that for you, creating a Store instance as injectible.
// You only need to inject it into your components' constructors.

// Here is a sample component for the Customer List.
// It's incomplete and created only to demonstrate how components work with the Store:

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@NgRX/store';
import { ICustomer } from 'src/models/customer.model';

@Component({
  selector: 'app-customers-list',
  template: '<the HTML template URL>'
})
export class CustomerListComponent implements OnInit, OnDestroy {
  customerList$: Observable<ICustomer[]>;
  private _customerList: ICustomer[] = [];

  contextCustomer$: Observable<ICustomer>;
  private _contextCustomer!: ICustomer;

  private _s = new Subscription();
  
  // A pointer to the application's Store is injected into the constructor:
  constructor(private _store: Store<any>) { }

  ngOnInit(): void {
    // Create subscriptions:
    this.customerList$ = this._store.select('customerList'); // notice that observables of the Store don't have $ in their names, so don't write select('customerList$')
    this.contextCustomer$ = this._store.select('contextCustomer');
    // The parameters passed to the select() functions are strings with the names of the current module's State properties, as defined in the model.  
    // Even though the entire Store is queried, only data of the current module's State is subscribed to.  
    // In other words, the Store can have observables with the same name for different modules without interfering with each other, and each modue "sees" only its own data.
    // For example, if the Store has contextCustomer for another module, it will be ignored by select('contextCustomer') in CustomerListComponent.

    // Populate the regular vars from the observables (to work with the data in the imperative way, if needed):
    this._s.add(
      this.customerList$.subscribe((customers: ICustomer[]) => { this._customerList = customers; })
    );
    this._s.add(
      this.contextCustomer$.subscribe((customer: ICustomer) => { this._contextCustomer = customer; })
    );
  }
}

// Note that any components of the module can access any properties of the module's state - even those which store data for other components of the same module.
// For example, if another component of our module needs to get the context customer, it will do the same call in its component class:
this.contextCustomer$ = this._store.select('contextCustomer');
// That eliminates the need to pass that customer from the parent component's template to the child components if they need the untouched, originally retrieved data.

// @@@ What is an Angular application?

// As mentioned, the Store is a singleton — there's only one Store instance per Angular application.  
// You might ask: "What if I open several browser tabs for different customers? Shouldn't the properties of ICustomerState be arrays, one State per tab?"  
// Here's the clarification: Angular applications follow the SDI (Single Document Interface) model, not MDI (Multiple Document Interface).  
// Only one screen is active at a time, but you can open multiple instances of the application.  
// So, each browser tab runs its own separate instance of the Angular app with its own singleton Store.

// ######################################################################################################
// * Action
// ######################################################################################################

// An Action is a plain TypeScript object used to express an event or an intention (usually a data manipulation or a change in the application's state).  
// Actions are dispatched (i.e. launched) in one part of the application (usually in components or services) and captured in others.  
// NgRX automatically manages the chain of fired events when an Action is dispatched, ensuring the appropriate consumers respond to it seamlessly.  
// Actions provide an easy global communication channel. They are one of the main building blocks in NgRX.

// The Action file is a module-level file, like the other files which will be described soon - Service, Effect and Reducer.
// Each file serves all the components of the module - CustomerCardComponent, OrderCardComponent and ProductCardComponent.

// An Action object has two properties:  
//   * type – a textual description of the intention.  
//   * payload (optional) – additional data required for the action (like retrieval parameters); payload is used to enforce type safety when the Action is dispatched.  

// An Action is created and returned by the createAction() factory function, which accepts type and payload.  
// The next example defines a few simple Actions. No payload for now, only type is passed to createAction().  
// It's a good practice to add the word "Action" to the names of Action objects:
import { createAction } from '@NgRX/store';
export const incrementAction = createAction('[Counter] Increment');
export const decrementAction = createAction('[Counter] Decrement');
export const resetAction = createAction('[Counter] Reset');

// @@@ Action TYPE - the 1st parameter to createAction()

// Must be unique across the entire application since it serves as a unique identifier for each Action.
// Having duplicate action types can lead to unintended consequences.

// Conventionally, the Action type consista of two parts:
"[Module] Description"
// "[Module]" (within square brackets) indicates the feature module where the action is used. For application-wide Actions, use [App].
// "Description" reflects the specific event that is fired.
// This structure allows different Modules to have Actions with a same Description, like '[Customer] Save' and '[Order] Save'.

// @@@ Action PAYLOAD - the 2nd parameter (optional) to createAction()

// Describes the payload (additional data) expected by the Action. That data must be provided when the Action is dispatched.
// The argument prevents sending wrong data to the Action, i.e. inforces strong typing.

// The payload is sent to createAction() via the props<T>() function, for example:
import { createAction, props } from '@NgRX/store';
export const insTodoAction = createAction('[Todo List] Insert', props<{ todoText: string }>());

// props<T>() takes a generic type parameter, which is the data type of the payload for compile-time type checking to ensure correct payload structure.
// In the example above, the props() defines that the action should carry a payload with a property `todoText` of type `string`, so a correct dispatch looks like this:
this._store.dispatch(insTodoAction({ todoText: 'Learn NgRX' }));
// The next calls will cause compilation-time errors:
this._store.dispatch(insTodoAction({ todoText: 123 })); // 'todoText' must be a string
this._store.dispatch(insTodoAction({ text: 'Learn NgRX' })); // 'text' is not defined in the props

// Note that the dispatch() method belongs to the Store singleton - that illustrates the application-wide scope of Actions.
// Usually, Action files of different modules are grouped together in a folder under the app's Store folder, like src/app/Store/actions/.

// The next example describes the Action file which could exist for our Customer screen.
// Firstly, the file declares a private enum each constant of which will be used as an Action type.

// Note that:
//   * Each CRUD operation of each entity has its dedicated Action.
//   * Each main CRUD Action is coupled with a ...Success action. The Success action is dispatched if its main Action has been executed successfully.

import { createAction } from '@NgRX/store';
import { ICustomer, IOrder, IProduct } from 'src/models/customer.model';

const m = '[Customer]'; // m = Module
const c = 'Customer';
const o = 'Order';
const p = 'Product';

enum d { // the Actions' "d"escriptions
  // Customer:
  SetContextCustomer = `${m} Set Context ${c}`, // displatched when a customer is highlighted in the customers list
  SelCustomerList = `${m} Select ${c} List`,
  SelCustomerListSuccess = `${SelCustomerList} Success`,
  SelCustomer = `${m} Select ${c}`,
  SelCustomerSuccess = `${SelCustomer} Success`,
  InsCustomer = `${m} Insert ${c}`,
  InsCustomerSuccess = `${InsCustomer} Success`,
  UpdCustomer = `${m} Update ${c}`,
  UpdCustomerSuccess = `${UpdCustomer} Success`,
  DelCustomer = `${m} Delete ${c}`,
  DelCustomerSuccess = `${DelCustomer} Success`,
  // Order:
  SelOrderList = `${m} Select ${o} List`,
  SelOrderListSuccess = `${SelOrderList} Success`,
  SelOrder = `${m} Select ${o}`,
  SelOrderSuccess = `${SelOrder} Success`,
  InsOrder = `${m} Insert ${o}`,
  InsOrderSuccess = `${InsOrder} Success`,
  UpdOrder = `${m} Update ${o}`,
  UpdOrderSuccess = `${UpdOrder} Success`,
  DelOrder = `${m} Delete ${o}`,
  DelOrderSuccess = `${DelOrder} Success`,
  // Product:
  SelProductList = `${m} Select ${p} List`,
  SelProductListSuccess = `${SelProductList} Success`,
  SelProduct = `${m} Select ${p}`,
  SelProductSuccess = `${SelProduct} Success`,
  InsProduct = `${m} Insert ${p}`,
  InsProductSuccess = `${InsProduct} Success`,
  UpdProduct = `${m} Update ${p}`,
  UpdProductSuccess = `${UpdProduct} Success`,
  DelProduct = `${m} Delete ${p}`,
  DelProductSuccess = `${DelProduct} Success`,
}

// Then, the Action file declares Action objects themselves.

// In most enterprise applications, dispatching an Action calls a function of a Web Service, so our example reflects that.
// The props parameter to the createAction() function describes the Action's payload:
//   * The payload of a regular (non-Success) CRUD Action defines the INPUT of the Web Service function the Action calls.
//   * The payload of a Success CRUD Action defines the OUTPUT of the same Web Service function.

// Customer:
export const setContextCustomerAction = createAction(d.SetContextCustomer, props<{ actionCustomer: ICustomer | null }>());
export const selCustomerListAction = createAction(d.SelCustomerList, props<{ actionLastName: string }>()); // grab customers whose last name contains actionLastName
export const selCustomerListSuccessAction = createAction(d.SelCustomerListSuccess, props<{ actionCustomerList: ICustomer[] }>());
export const selCustomerAction = createAction(d.SelCustomer, props<{ actionCustomerId: number }>());
export const selCustomerSuccessAction = createAction(d.SelCustomerSuccess, props<{ actionCustomer: ICustomer }>());
export const insCustomerAction = createAction(d.InsCustomer, props<{ actionCustomer: ICustomer }>());
export const insCustomerSuccessAction = createAction(d.InsCustomerSuccess, props<{ actionCustomer: ICustomer }>());
export const updCustomerAction = createAction(d.UpdCustomer, props<{ actionCustomer: ICustomer }>());
export const updCustomerSuccessAction = createAction(d.UpdCustomerSuccess, props<{ actionCustomer: ICustomer }>());
export const delCustomerAction = createAction(d.DelCustomer, props<{ actionCustomerId: number }>());
export const delCustomerSuccessAction = createAction(d.DelCustomerSuccess, props<{ actionCustomerId: number }>());
// Order:
export const selOrderListAction = createAction(d.SelOrderList, props<{ actionCustomerId: number }>()); // grab orders of this customer
export const selOrderListSuccessAction = createAction(d.SelOrderListSuccess, props<{ actionOrderList: IOrder[] }>());
export const selOrderAction = createAction(d.SelOrder, props<{ actionOrderId: number }>());
export const selOrderSuccessAction = createAction(d.SelOrderSuccess, props<{ actionOrder: IOrder }>());
export const insOrderAction = createAction(d.InsOrder, props<{ actionOrder: IOrder }>());
export const insOrderSuccessAction = createAction(d.InsOrderSuccess, props<{ actionOrder: IOrder }>());
export const updOrderAction = createAction(d.UpdOrder, props<{ actionOrder: IOrder }>());
export const updOrderSuccessAction = createAction(d.UpdOrderSuccess, props<{ actionOrder: IOrder }>());
export const delOrderAction = createAction(d.DelOrder, props<{ actionOrderId: number }>());
export const delOrderSuccessAction = createAction(d.DelOrderSuccess, props<{ actionOrderId: number }>());
// Product:
export const selProductListAction = createAction(d.SelProductList, props<{ actionOrderId: number }>()); // grab products of this order
export const selProductListSuccessAction = createAction(d.SelProductListSuccess, props<{ actionProductList: IProduct[] }>());
export const selProductAction = createAction(d.SelProduct, props<{ actionProductId: number }>());
export const selProductSuccessAction = createAction(d.SelProductSuccess, props<{ actionProduct: IProduct }>());
export const insProductAction = createAction(d.InsProduct, props<{ actionProduct: IProduct }>());
export const insProductSuccessAction = createAction(d.InsProductSuccess, props<{ actionProduct: IProduct }>());
export const updProductAction = createAction(d.UpdProduct, props<{ actionProduct: IProduct }>());
export const updProductSuccessAction = createAction(d.UpdProductSuccess, props<{ actionProduct: IProduct }>());
export const delProductAction = createAction(d.DelProduct, props<{ actionOrderId: number, actionProductId: number }>()); // delete the product from the order
export const delProductSuccessAction = createAction(d.DelProductSuccess, props<{ actionProductId: number }>());

// === END OF THE Action FILE ===

// We've just seen how Actions are created (declared).
// Now, let's see how they would be dispatched in the CustomerCardComponent (of course, they would be in different parts of the component class):
this._store.dispatch(selCustomerListAction({ actionLastName: this._lastName }));
this._store.dispatch(selCustomerAction({ actionCustomerId: highlightedCustomerId })); // highlightedCustomerId is a param of delCustomer() function called from the template
this._store.dispatch(insCustomerAction({ actionCustomer: this._contextCustomer }));
this._store.dispatch(updCustomerAction({ actionCustomer: this._contextCustomer }));
this._store.dispatch(delCustomerAction({ actionCustomerId: this._contextCustomer.customerId }));

// There are a few rules to writing good actions within your application:
// * Divide - categorize actions based on the event source.
// * Many - actions are inexpensive to write, so the more actions you write, the better you express flows in your application.
// * Event-Driven - capture events not commands as you are separating the description of an event and the handling of that event.

// Write actions upfront - before developing Components which will dispatch them.
// Usually, when it's time to create Actions, you've already created respective web-services (described next) which manipulate the module's data,
// so you must have a strong initial idea which Actions you need for working with the web-services.

// ######################################################################################################
// * Service
// ######################################################################################################

// The class for outsourcing logic and data that directly calls the web service.  
// It's the "last station" of data flow within Angular before data is sent to the middle tier on the Web.  
// The class name simply says "Service", but think of it as "web service."  
// Strictly speaking, this class is not a part of the NgRX library, but it's commonly found in apps that interact with a web service, which is the standard architecture.

// Typically, Services are injected into other areas of our app, so they must have the @Injectable decorator.
// The next Service is injected into the Effect class (which will be described next):

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { baseUrl } from 'src/app/common/navigation';
import { Observable } from 'rxjs';
import { ICustomer, IOrder, IProduct } from 'src/models/customer.model';

@Injectable({ providedIn: 'root' })
export class CustomerService {
  private readonly _customersUrl = `${baseUrl}/customers`;
  private readonly _ordersUrl = `${baseUrl}/orders`;
  private readonly _productsUrl = `${baseUrl}/products`;

  constructor(private _http: HttpClient) {}

  // Customer:

  selCustomerList(lastName: string): Observable<ICustomer[]> {
    return this._http.get<ICustomer[]>(this._customersUrl, lastName);
  }

  selCustomer(customerId: number): Observable<ICustomer> {
    return this._http.get<ICustomer>(`${this._customersUrl}/${customerId}`, customerId);
  }

  insCustomer(customer: ICustomer): Observable<ICustomer> { // returns the inserted customer with the ID, updatedBy & updatedAt genereted by the DB
    return this._http.post<ICustomer>(`${this._customersUrl}/ins`, customer)
  }

  updCustomer(customer: ICustomer): Observable<ICustomer> { // returns the updated customer with the updatedBy & updatedAt genereted by the DB
    return this._http.put<ICustomer>(`${this._customersUrl}/upd`, customer);
  }

  delCustomer(customerId: number): Observable<void> {
    return this._http.delete<void>(`${this._customersUrl}/del`, customerId);
  }

  // Order:

  // < ... A SIMILAR FRAGMNENT FOR ORDER FUNCTIONS HERE, USING this._ordersUrl ... >

  // Product:

  // < ... A SIMILAR FRAGMNENT FOR PRODUCT FUNCTIONS HERE, USING this._productsUrl ... >
}
// Notice that the generic type parameter, passed to the HTTP functions - get(), post(), put() & delete() - describes the type, returned by the web service - not the type sent to it.
// For example, selCustomerList passes ICustomer[] - get<ICustomer[]> - since an array of customers is expected from the web service.

// Also notice that the HTTP functions must fit the HTTP request types, expected by the web service, as well as the URLs must be parsable by the web service.
// Here's the suggested URL convention:

// -------------------------------------------------------------------------------------------------------------------------
// CRUD OPERATION:      HTTP:   THE MAIN (PARENT) ENTITY:  A CHILD ENTITY:
// -------------------------------------------------------------------------------------------------------------------------
// SELECT all entities  GET     /entities                  /entities/{parentEntityId}/child_entities
// SELECT an entity     GET     /entities/{entityId}       /entities/{parentEntityId}/child_entities/{childEntityId}
// INSERT an entity     POST    /entities/ins              /entities/{parentEntityId}/child_entities/ins
// UPDATE an entity     PUT     /entities/upd/{entityId}   /entities/{parentEntityId}/child_entities/upd/{childEntityId}
// DELETE an entity     DELETE  /entities/del/{entityId}   /entities/{parentEntityId}/child_entities/del/{childEntityId}
// -------------------------------------------------------------------------------------------------------------------------

// The INSERT URL doesn't include the ID - obviously, that ID has not been generated by the DB yet. Instead, an object of ICustomer type is passed to insCustomer.
// An object of ICustomer type is also sent to the UPDATE web service, and it contains the ID.
// So, there is no need to add the ID to the URL for UPDATE. But we do that for the user to see consistent URLs across the app.

// We can create services with commands:
ng generate service MyService
ng g s MyService

// ######################################################################################################
// * Effect
// ######################################################################################################

// Side effects are operations that happen outside the Angular context, such as calling external APIs, making HTTP requests, or accessing local storage.  
// If your application needs to perform a side effect, you define an Effect class.  

// Effects are built using RxJS Observables and are designed to listen for specific Actions and perform side effects without directly modifying the Store.  
// The Effect class captures a dispatched main (i.e. non-"Success") Action and calls the respective method in the Web Service class.  
// After that call, the Effect is the "first station" within Angular to handle the data returned from the middle tier.  
// Once a side effect is successfully completed, the Effect typically dispatches the corresponding "Success" Action to update the Store with the external call results.  

// We'll use the Customer screen to demonstrate how an Effect class handles side effects.
// The class name uses just "Effect" for brevity, but it stands for "Side Effect":

import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@NgRX/effects';
import { CustomerService } from '../services/customer.service';
import { ICustomer, IOrder, IProduct } from 'src/models/customer.model';
import {
  // Customer:
  selCustomerListAction,
  selCustomerListSuccessAction,
  selCustomerAction,
  selCustomerSuccessAction,
  insCustomerAction,
  insCustomerSuccessAction,
  updCustomerAction,
  updCustomerSuccessAction,
  delCustomerAction,
  delCustomerSuccessAction,
  // Order:
  // < ...ORDER ACTIONS HERE... >
  // Product:
  // < ...PRODUCT ACTIONS HERE... >
} from 'src/app/Store/actions/customer.action';
import { switchMap, map, catchError } from 'rxjs/operators';
import { EMPTY } from 'rxjs';

@Injectable()
export class CustomerEffect {
  constructor(
    private _actions$: Actions,
    private _svc: CustomerService // Remember we defined CustomerService with the @Injectable() directive? Now we inject it into the Effect through its constructor
  ) {}

  // Customer:

  // createEffect() is an NgRX function used to define and register effects.
  // It accepts a factory function that returns an Observable, defining the logic for handling side effects based on Actions,
  //    and returns EffectConfig - an Observable managed by NgRX that triggers side effects and optionally dispatches Actions:
  selCustomerList$ = createEffect(() =>
    this._actions$.pipe(
      // ofType() is an NgRX operator that allows only Actions with specific types to pass through.
      // It filters the Observable stream to listen specifically for the Action it handles.
      // This means the subsequent operators in the pipe will only run when selCustomerListAction is dispatched.
      ofType(selCustomerListAction),
      // switchMap takes an observable, maps each emitted value to a new inner observable, and switches to the latest one, cancelling any previous subscriptions.
      // Think of it as “forget the past, focus on the present”:
      switchMap((action) => {
        // Call the Web Service function passing to it the Action's payload as input:
        return this._svc.selCustomerList(action.actionLastName).pipe(
          // If no errors, dispatch the respective Success Action passing to it the Web Service function's output:
          map((customerList: ICustomer[]) => selCustomerListSuccessAction({ actionCustomerList: customerList })),
          catchError(() => EMPTY), // a real app would include an error handler, but let's leave that out for now
        );
      }),
    ),
  );

  selCustomer$ = createEffect(() =>
    this._actions$.pipe(
      ofType(selCustomerAction),
      switchMap((action) => {
        return this._svc.selCustomer(action.actionCustomerId).pipe(
          map((customer: ICustomer) => selCustomerSuccessAction({ actionCustomer: customer })),
          catchError(() => EMPTY),
        );
      }),
    ),
  );

  insCustomer$ = createEffect(() =>
    this._actions$.pipe(
      ofType(insCustomerAction),
      switchMap((action) => {
        return this._svc.insCustomer(action.actionCustomer).pipe(
          map((customer: ICustomer) => insCustomerSuccessAction({ actionCustomer: customer })),
          catchError(() => EMPTY),
        );
      }),
    ),
  );

  updCustomer$ = createEffect(() =>
    this._actions$.pipe(
      ofType(updCustomerAction),
      switchMap((action) => {
        return this._svc.updCustomer(action.actionCustomer).pipe(
          map((customer: ICustomer) => updCustomerSuccessAction({ actionCustomer: customer })),
          catchError(() => EMPTY),
        );
      }),
    ),
  );

  delCustomer$ = createEffect(() =>
    this._actions$.pipe(
      ofType(delCustomerAction),
      switchMap((action) => {
        return this._svc.delCustomer(action.actionCustomerId).pipe(
          map(() => delCustomerSuccessAction( { actionCustomerId: action.actionCustomerId })),
          catchError(() => EMPTY),
        );
     }),
    ),
  );

  // Order:

  // < ...A SIMILAR FRAGMNENT FOR ORDER ACTIONS HERE... >

  // Product:

  // < ...A SIMILAR FRAGMNENT FOR PRODUCT ACTIONS HERE... >
}

// ######################################################################################################
// * Reducer
// ######################################################################################################

// Reducer is a pure function which defines how the State of your module changes in response to Actions.
// It listens for dispatched Actions; when an Action, requiring handling, is captured, the Reducer modifies the State based on the current State and the Action's data.
// That is done in an immutable way, creating a new State object. Angular discards the old State object, replacing it with the new one.

// The mission of the Reducer is critical – it's responsible for updating the State with the results of the Web Service calls when a ...Success Action is dispatched by the Effect.

// Also, you can create and dispatch Actions which update the State without calling side effects - like those without ...Success counterparts in the example below.
// That is the correct way to update the State! We don't change it in other classes directly, even though technically it's possible.
// Instead, other classes dispatch Actions which signal the Reducer to change the State.
// So, Reducer is the only function which is allowed to directly update State for the given module.
// Having such a centralized spot significantly simplifies debugging - if the State is updated in a wrong way, you immediately know where to drop a breakpoint.

// Here is an example Reducer file for our Customer module:

import { Action, createReducer, on } from '@NgRX/store';
import * as _ from 'lodash';
import { ICustomerState, initialCustomerState } from '../states/customer.state';
import { ICustomer, IOrder, IProduct } from 'src/models/customer.model';
import {
  // Customer:
  setContextCustomerAction,
  selCustomerListAction,
  selCustomerListSuccessAction,
  selCustomerSuccessAction,
  insCustomerSuccessAction,
  updCustomerSuccessAction,
  delCustomerSuccessAction,
  // Order:
  // < ...ORDER ACTIONS HERE... >
  // Product:
  // < ...PRODUCT ACTIONS HERE... >
} from 'src/app/Store/actions/customer.action';

// A Reducer function takes two arguments - the current State and the latest Action dispatched - and returns a new State:
export function customerReducer(oldState: ICustomerState | undefined, action: Action): ICustomerState {
  return getNewState(oldState, action);
}

// Now we will call createReducer() which creates a reducer function by combining an initial state with multiple on() handlers
//    that specify how the state changes in response to dispatched actions.
// It simplifies writing reducers by providing a clear, declarative way to map actions to state update functions in NgRX.
// createReducer() is defined in NgRX this way:
// createReducer<S, A extends Action = Action>(
//   initialState: S,
//   ...ons: On<S>[]
// ): ActionReducer<S, A>
// Parameters:
//    initialState: S — starting state object
//    ...ons: On<S>[] — array (vararg) of on() mappings (action type → reducer function)
// Returns:
//    ActionReducer<S, A> — final reducer function for the store.

// If the Action is handled in the reducer function, the new State replaces the exisitng one, otherwise the exisitng State remains untouched:
const getNewState = createReducer(
  // Remember we create initialCustomerState in the Model file? Now it's time to utilize it.
  // When the app starts, NgRX initializes the entire store tree by invoking every reducer once with a special internal action '@NgRX/store/init':
  // reducer(undefined, { type: '@NgRX/store/init' })
  // As you see, the old state is passed as undefined (indeed, there is no old state yet at bootstrap).
  // So, we must provide a default state as the first parameter to createReducer (it also dictates the shape NgRX will use to type-check the old state on next calls):
  initialCustomerState,

  // The second parameter to createReducer is an array (vararg) of on() functions.
  // on() is a function used to define how the state changes in response to specific Actions inside a Reducer.
  // It links an Action (the 1st arg) to a callback function changing the State (the 2nd arg).
  // In simple words, on() tells the Reducer: "when this Action is dispatched, run this specific State update function".
  
  // Customer:

  on(setContextCustomerAction, (state: ICustomerState, { actionCustomer: newContextCustomer }) => ({
    ...state, // copy all the properties of the old State to the new State unchanged...
    contextCustomer: newContextCustomer // ...and override contextCustomer whith the new value
    // Since HTML controls are subscribed to the State, this change will be immediately reflected in GUI.
  })),

  on(selCustomerListAction, (state: ICustomerState) => ({
    ...state,
   customerListLoaded: false // the retrieval has started, so display the progress bar
  })),

  on(selCustomerListSuccessAction, (state: ICustomerState, { actionCustomerList: selectedCustomerList }) => ({
    ...state,
    customerList: selectedCustomerList,
    customerListLoaded: true // the retrieval has finished, so hide the progress bar
  })),
  
  on(selCustomerAction, (state: ICustomerState) => ({
    ...state,
    customerLoaded: false // the retrieval has started, so display the progress bar
  })),

  on(selCustomerSuccessAction, (state: ICustomerState, { actionCustomer: selectedCustomer }) => ({
    ...state,
    contextCustomer: selectedCustomer,
    customerLoaded: true // the retrieval has finished, so hide the progress bar
  })),

  on(insCustomerSuccessAction, (state: ICustomerState, { actionCustomer: insertedCustomer }) => ({
    ...state,
    // Refresh the context Customer to populate the DB-generated fields - customerId, updatedBy & updatedAt:
    contextCustomer: insertedCustomer,
    // Add the INSERTed Table to the Customers List:
    customerList: [...state.customerList, insertedCustomer]
  })),

  on(updCustomerSuccessAction, (state: ICustomerState, { actionCustomer: updatedCustomer }) => ({
    ...state,
    // Refresh the context Customer to populate the DB-generated fields - updatedBy & updatedAt:
    contextCustomer: updatedCustomer,
    // Refresh the UPDATEd Customer in the Customers List:
    customerList: state.customerList.map(
      (customerInList: ICustomer) => customerInList.customerId === updatedCustomer.customerId ? updatedCustomer : customerInList
    )
  })),

  on(delCustomerSuccessAction, (state: ICustomerState, { actionCustomerId: deletedCustomerId }) => ({
    ...state,
    // Dispose of the DELETEd Customer:
    contextCustomer: null,
    // Remove the DELETEd Customer from the Customers List:
    customerList: state.customerList.filter(
      (customerInList: ICustomer) => customerInList.customerId !== deletedCustomerId
    )
  })),

  // Order:

  // < ...A SIMILAR FRAGMNENT FOR ORDER ACTIONS HERE... >

  // Product:

  // < ...A SIMILAR FRAGMNENT FOR PRODUCT ACTIONS HERE... >
);

// The spread operator (...state) only does shallow copying and does not handle deeply nested objects.
// You need to copy each level in the object to ensure immutability.
// There are libraries that handle deep copying including lodash and immer.

// ######################################################################################################
// * The Action's life cycle
// ######################################################################################################

// As you've seen, Actions fall into three categories:

// 1. Actions that are called from business logic and trigger external Effects (usually, web service calls). They have counterpart Success Actions.
// A typical example - Actions for CRUD operations.
// Such Actions do not change the State with business data (they only turn on the progress bar display flag).

// 2. Success Actions. Called from the Effect class in case of successful execution of the main Action.
// Their task is updating the State with the result, retuned by the Effect.
// Some applications also use Failure Actions, called from the Effect class in case of an error in the main Action, if the State must be updated with the failure info.

// 3. Actions that are called from business logic and DO NOT trigger external Effects.
// They manipulate data which already exists on the front end and should not be saved immediately (or should not be saved at all, like internal mechanics variables).
// For example, SetContextCustomer receives payload as an ICustomer object that was retrieved from the web service earlier, and only copied it to the State -
//    if that data will be updated by the used, another Action will save it outside later.

// Let me remind you once again that any physical changes to the State must be made only within the Reducer.
// Components must dispatch Actions rather than assign values ​​to the State fields directly.

// Let's briefly summarize the life cycle stages that an Action goes through:

// Actions related to Effects (categories 1 & 2):

// 1. The component dispatches a regular (not Success) Action.
// 2. The Reducer captures it and updates the State to display the progress bar.
// 3. The Effect captures the Action and calls the corresponding function of the Service, passing the payload as an input.
// 4. The Service sends an HTTP request to the web service and is waiting for the response.
// 5. When an HTTP response is received, the Service function passes the received data to the Effect.
// 6. If the call was successful, the Effect dispatches the respective Success Action, passing the data returned by the web service.
// 7. The Reducer captures the Success Action, updates the State with the data received the Service, and turns off the progress bar flag.

// Actions unrelated to Effects (category 3):

// 1. The component dispatches an Action.
// 2. The Reducer captures it and writes the payload to the State.