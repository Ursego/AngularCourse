// CONTENTS (to jump to a section, copy it with the asterisk, like "* ngOnDestroy" -> Ctrl+F -> Ctrl+V):

// * ngOnInit
// * ngDoCheck
// * ngAfterContentInit
// * ngAfterContentChecked
// * ngAfterViewInit
// * ngAfterViewChecked
// * ngOnChanges
// * ngOnDestroy

// Lifecycle hooks are specific functions automatically called by Angular that allow you to tap into specific moments in the life of a component object.
// To implement a lifecycle hook, import the corresponding interface from `@angular/core` and have the component class implement it.

// If you just started learning Angular, you don't need to bone up this whole file. For now, get familiar with only three hooks which are most frequently used:
// - ngOnInit
// - ngAfterViewInit
// - ngOnDestroy
// Later, when you dive deeper into Angular or start working, you can use this file as a reference for all the hooks.

// ######################################################################################################
// * ngOnInit
// ######################################################################################################

// Called ONLY ONCE after the component's constructor is executed and input properties (the properties passed from the parent component) are set.
// Runs when the component has been constructed but before it's displayed to the user.
// Provides a reliable spot for initialization tasks that depend on the component's input properties being available.
// It's a good place to put initialization logic, such as fetching data, populating the component's vars from the Store, configuring default settings.
// The hook is fundamental for executing logic that needs to occur once when the component is instantiated.

// In ngOnInit, you can safely interact with the component's data, but not with the HTML template which has not been rendered yet.
// You cannot manipulate DOM elements, or interact with child components which still have not been created.
// To perform initalizations in the template or accessing child components, use the ngAfterViewInit hook described later.

// As an example, let's write a component that fetches user data from a service and displays it (it's a common use of ngOnInit).
// We'll simulate the fetching operation with a service that returns a list of users.

// First, define a User interface to specify the structure of a user object:

export interface User {
  id: number;
  name: string;
}

// Next, create UserService - the service which is responsible for fetching user data:

import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User } from './user.model'; // import the User interface

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor() { }

  getUsers(): Observable<User[]> {
    // The real method would retrieve users from a web service, but we simulate an HTTP response for simplicity:
    return of([
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
      { id: 3, name: 'Charlie' }
    ]);
  }
}
// The of() function of RxJS creates an observable - you will learn it later.
// For now, simply think about it as a variable, the value of which automatically changes when the variable it observes changes.

// Finally, create the component:

import { Component, OnInit } from '@angular/core';
import { User } from './user.model';
import { UserService } from './user.service';

@Component({
  selector: 'app-user-list',
  template: `
    <h2>User List</h2>
    <ul>
      <li *ngFor="let user of users">{{ user.name }}</li>
    </ul>
  `
})
export class UserListComponent implements OnInit { // <<<<<<<<<<<<<<<<<<<<<<<< notice "implements OnInit"
  users: User[] = [];

  // The UserService is injected into the UserListComponent through its constructor:
  constructor(private _userSvc: UserService) { }

  // The fetchUsers method is responsible for initiating the data-fetching process from the UserService object.
  // It subscribes to the Observable returned by the getUsers method of the service, setting the component's users property with the fetched data.
  // This data binding will subsequently update the view to display the list of users.
  fetchUsers(): void {
    this._userSvc.getUsers().subscribe(data => {
      this.users = data;
    }, error => {
      console.error('Failed to fetch users', error);
    });
  }

  // By calling fetchUsers in ngOnInit, we ensure that it runs once the component is properly constructed but before it's displayed to the user:
  ngOnInit(): void {
    this.fetchUsers();
  }

  // The unsubscribing logic is omitted for simplicity - you will learn about it later.
}

// Using ngOnInit for fetching data separates construction from initialization logic.
// ngOnInit ensures the component's constructor remains light and focused only on setting up dependency injection,
//    without side effects like data fetching.

// ######################################################################################################
// * ngDoCheck
// ######################################################################################################

// Angular’s change detection is a mechanism which runs every time an application event occurs (user input, HTTP response, timer, etc.).
// During this cycle, Angular walks the component tree from top to bottom and compares current data-bound values with their previous values.
// If a value has changed, Angular updates the DOM accordingly.

// The ngDoCheck hook is called during every change detection cycle.
// Useful when you need to detect changes that Angular's built-in change detection mechanism might miss,
//    especially in properties which are mutable objects or array that are not caught by the default change detection
//    which does not detect changes WITHIN objects and arrays (unless the reference to the entire object or array has changed).
// Used to implement manual/custom change detection logic or to perform checks immediately after the default change detection has run.

// In the next example, we'll create a component that monitors an array of objects for changes.
// ngDoCheck allows you to manually check for such changes.

// Let's set up a simple component with an array of objects. We'll also add a method to modify one of the objects in the array:

import { Component, DoCheck, IterableDiffers } from '@angular/core';

@Component({
  selector: 'app-watch-list',
  template: `
    <h1>Items</h1>
    <ul>
      <li *ngFor="let item of items">{{ item.name }} - {{ item.quantity }}</li>
    </ul>
    <button (click)="changeItem()">Change Item</button>
  `
})
export class WatchListComponent implements DoCheck {
  items = [
    { name: 'Apples', quantity: 10 },
    { name: 'Oranges', quantity: 20 }
  ];

  private differ: any;

  constructor(private differs: IterableDiffers) {
    this.differ = this.differs.find(this.items).create();
  }

  ngDoCheck() {
    const change = this.differ.diff(this.items);
    if (change) {
      console.log('Changes detected!');
      change.forEachChangedItem(item => console.log('Changed item:', item));
    }
  }

  changeItem() {
    this.items[0].quantity = 15; // This change is internal and won't trigger Angular's default change detection.
  }

// Explanation:

// 1. Component Definition:
//		The `WatchListComponent` manages an array of items, each with a `name` and a `quantity`.
//		The template lists these items and includes a button to change the quantity of the first item.

// 2. Detecting Changes with `ngDoCheck`:
//   - We use `IterableDiffers` to create a differ for the array. This service helps in tracking changes in collections.
//   - In `ngDoCheck`, we check for differences using this differ.
//		If any differences are found (like when `changeItem()` is called), we log these changes to the console.
//		This demonstrates how `ngDoCheck` can be used to catch updates inside complex structures like arrays of objects.

// 3. Modifying an Item:
//		The `changeItem` method modifies the `quantity` of the first item in the array.
//		Normally, Angular wouldn't check deep changes within objects in an array, but thanks to `ngDoCheck` and `IterableDiffers`,
//		we can manually detect these changes.

// Another example:

// The chuld component:

import { Component, DoCheck, Input, IterableDiffers } from '@angular/core';

@Component({
  selector: 'app-todo-list',
  template: `
    <h2>Todo List</h2>
    <ul>
      <li *ngFor="let item of todoItems">{{ item }}</li>
    </ul>
    <p>Items changed: {{ changeDetected }} times</p>
  `
})
export class TodoListComponent implements DoCheck {
  @Input() todoItems: string[] = [];
  
  private differ: any;
  changeDetected = 0;

  constructor(private differs: IterableDiffers) {
    this.differ = this.differs.find([]).create();
  }

  ngDoCheck() {
    const changes = this.differ.diff(this.todoItems);
    
    if (changes) {
      this.changeDetected++;
      console.log('Changes detected!');
      changes.forEachAddedItem(item => console.log('Added ' + item.item));
      changes.forEachRemovedItem(item => console.log('Removed ' + item.item));
    }
  }
}

// The parent component. Pay attention how the todos array is passed to the chaild component:

@Component({
  selector: 'app-root',
  template: `
    <app-todo-list [todoItems]="todos"></app-todo-list>
    <button (click)="addItem()">Add Item</button>
  `
})
export class AppComponent {
  todos = ['Learn Angular', 'Build an app'];

  addItem() {
    this.todos.push('New todo item');
  }
}

// Remember, while `ngDoCheck` provides powerful capabilities to intercept and act on changes, it runs very frequently.
// Therefore, any heavy computations or complex logic inside `ngDoCheck` should be handled carefully to avoid degrading performance.

// ######################################################################################################
// * ngAfterContentInit
// ######################################################################################################

// Called ONLY ONCE after the first `ngDoCheck`.
// Called after Angular initializes the content children - the content projected into the component from an external template using <ng-content>.
// This means that it is triggered once all the content inside <ng-content> tags of the component's template has been initialized.
// This includes any dynamic content that has been added through content projection.
// Useful when a component performs actions or initialization that depends on child components projected into it from another (parent) component.

import { Component, AfterContentInit, ContentChild, ContentChildren, QueryList } from '@angular/core';

// Child component that will be projected
@Component({
  selector: 'app-tab',
  template: `<ng-content></ng-content>`
})
export class TabComponent {
  @Input() title: string = '';
}

// Parent component using content projection
@Component({
  selector: 'app-tab-container',
  template: `
    <div class="tab-headers">
      <button *ngFor="let tab of tabs" (click)="selectTab(tab)">
        {{ tab.title }}
      </button>
    </div>
    <div class="tab-content">
      <ng-content></ng-content>
    </div>
    <p>Active Tab: {{ activeTab?.title }}</p>
  `
})
export class TabContainerComponent implements AfterContentInit {
  @ContentChildren(TabComponent)
  tabs!: QueryList<TabComponent>;
  
  @ContentChild(TabComponent)
  firstTab!: TabComponent;
  
  activeTab: TabComponent | null = null;

  ngAfterContentInit() {
    // Set the first tab as active by default
    if (this.tabs.length > 0) {
      this.activeTab = this.firstTab || this.tabs.first;
    }
    
    console.log('Total tabs:', this.tabs.length);
    this.tabs.forEach((tab, index) => {
      console.log(`Tab ${index + 1} title:`, tab.title);
    });
  }

  selectTab(tab: TabComponent) {
    this.activeTab = tab;
  }
}

// In this example:

// * We have a TabComponent which represents individual tabs.
// * We have a TabContainerComponent which uses content projection to allow multiple TabComponents to be inserted into it.
// * In the TabContainerComponent, we use @ContentChildren to query all projected TabComponents and @ContentChild to get the first TabComponent.
// * The ngAfterContentInit hook is used to:
// 		** Set the first tab as active by default.
// 		** Log information about the projected tabs.
// * This hook ensures that we can interact with the projected content after it has been initialized.

// To use these components, you might have a parent component like this:

@Component({
  selector: 'app-root',
  template: `
    <app-tab-container>
      <app-tab title="Tab 1">Content for Tab 1</app-tab>
      <app-tab title="Tab 2">Content for Tab 2</app-tab>
      <app-tab title="Tab 3">Content for Tab 3</app-tab>
    </app-tab-container>
  `
})
export class AppComponent {}

// ######################################################################################################
// * ngAfterContentChecked
// ######################################################################################################

// Called after each `ngDoCheck` (first time - after `ngAfterContentInit`).
// Eensures that any changes in the content part of the component (like projected content via <ng-content>) are processed and updated if necessary.
// Usage: Respond after Angular checks the content projected into the directive or component.
// Useful for checking any content that could have been updated by Angular and needs to be re-evaluated after every check of the component's content.
// This could involve responding to changes resulting from <ng-content> or checking conditions after child directives and components
//		have been checked and potentially updated.

import { Component, AfterContentChecked, ContentChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-content-wrapper',
  template: `
    <div class="wrapper">
      <ng-content></ng-content>
    </div>
    <p>Content height: {{ contentHeight }}px</p>
    <p>Check count: {{ checkCount }}</p>
  `
})
export class ContentWrapperComponent implements AfterContentChecked {
  @ContentChild('content') contentElement!: ElementRef;
  
  contentHeight: number = 0;
  checkCount: number = 0;
  
  ngAfterContentChecked() {
    this.checkCount++;
    
    if (this.contentElement) {
      const newHeight = this.contentElement.nativeElement.offsetHeight;
      if (newHeight !== this.contentHeight) {
        this.contentHeight = newHeight;
        console.log('Content height changed:', this.contentHeight);
      }
    }
  }
}

@Component({
  selector: 'app-dynamic-content',
  template: `
    <div #content>
      <p *ngFor="let item of items">{{ item }}</p>
    </div>
    <button (click)="addItem()">Add Item</button>
  `
})
export class DynamicContentComponent {
  items: string[] = ['Initial item'];

  addItem() {
    this.items.push(`New item ${this.items.length + 1}`);
  }
}

@Component({
  selector: 'app-root',
  template: `
    <app-content-wrapper>
      <app-dynamic-content></app-dynamic-content>
    </app-content-wrapper>
  `
})
export class AppComponent {}

// In this example:
// 1. We have a `ContentWrapperComponent` that uses content projection to wrap some dynamic content.
// 2. The `ContentWrapperComponent` implements `ngAfterContentChecked` to:
//      - Keep track of how many times the content has been checked.
//      - Monitor the height of the projected content and log when it changes.
// 3. We have a `DynamicContentComponent` that allows adding items dynamically.
// 4. The `AppComponent` combines these, projecting the `DynamicContentComponent` into the `ContentWrapperComponent`.

// The `ngAfterContentChecked` hook is particularly useful here because:
// 1. It runs after every change detection cycle, allowing us to react to any changes in the projected content.
// 2. We can monitor properties of the projected content (in this case, its height) that might change due to internal state changes or user actions.
// 3. It allows us to perform actions based on these changes, such as updating our component's state or triggering additional logic.

// Key points to note:

// - `ngAfterContentChecked` is called frequently, so be cautious about putting heavy computations inside it to avoid performance issues.
// - The check count will increase on every change detection cycle, not just when the content changes.
//		This can be useful for debugging or performance monitoring.

// When you interact with this component by clicking the "Add Item" button:
// 1. The `DynamicContentComponent` will add a new item to its list.
// 2. Angular's change detection will run.
// 3. `ngAfterContentChecked` in `ContentWrapperComponent` will be called.
// 4. If the new item caused the content's height to change, this will be detected and logged.

// This pattern is useful when you need to react to changes in projected content, especially when those changes
// might affect layout or when you need to synchronize some state based on the content's properties.

// ######################################################################################################
// * ngAfterViewInit
// ######################################################################################################

// Called ONLY ONCE after the first `ngAfterContentChecked`.
// Usage: Respond after Angular initializes the component's views and child views, or the view that contains the directive.
// A critical point in the component lifecycle where developers can safely interact with the component's view for the first time
//   (as you remember, you cannot access the DOM elements yet in the constructor or ngOnInit). 
// Particularly important for any operations that require manipulating DOM elements, or interact with child components that are fully rendered.
// Typical Uses:
//	* Accessing Child Components:
//		This hook is ideal for querying and interacting with child components because they are guaranteed to be rendered and initialized at this point.
//	* DOM Manipulations:
//		Any DOM interactions (like initial focus setting, measuring elements, or applying direct DOM manipulations) should ideally be done in this hook
//			to ensure all elements are present and fully rendered.
//	* Integration with UI Libraries:
//		When using external UI libraries that need to interact with the DOM (like jQuery plugins or D3 visualizations), ngAfterViewInit provides
//			a reliable phase to initialize these libraries.
//	* Responsive Post-Rendering Actions:
//		For actions that need to react to component layout or visible state, such as adjusting dimensions after rendering or performing animations.

// Here's an example of an Angular component that demonstrates all four typical uses of the ngAfterViewInit lifecycle hook:
import { Component, ElementRef, ViewChild, AfterViewInit, ViewChildren, QueryList } from '@angular/core';

@Component({
  selector: 'app-example-component',
  template: `
    <div #myDiv>Hello, world!</div>
    <button #buttons>Click Me!</button>
    <app-child-component #childComp></app-child-component>
  `
})
export class ExampleComponent implements AfterViewInit {
  @ViewChild('myDiv') myDiv: ElementRef; // access to the DOM element
  @ViewChildren('buttons') buttons: QueryList<ElementRef>; // access to multiple DOM elements
  @ViewChild('childComp') childComponent: ElementRef; // access to child component

  constructor() {}

  ngAfterViewInit() {
    // 1. Accessing Child Components
    // The ViewChild and ViewChildren decorators are used to reference child components and multiple elements respectively,
    // which are fully accessible in ngAfterViewInit.
    console.log('Child component instance:', this.childComponent);

    // 2. DOM Manipulations
    // Directly manipulating the DOM using nativeElement is shown here.
    // This is practical for applying styles or properties that depend on the component being fully rendered.
    this.myDiv.nativeElement.style.backgroundColor = 'yellow'; // direct DOM manipulation
    console.log('DOM element after view init:', this.myDiv.nativeElement.innerHTML);

    // 3. Integration with UI Libraries
    // Although actual library integration like jQuery is not recommended in Angular due to potential conflicts with Angular's DOM management,
    // this example adjusts styles to demonstrate how you might otherwise initialize a library or plugin that manipulates these elements.
    // Assuming a library that requires an element selector jQuery-like usage example (purely for demonstration)
    // $('.buttons').pluginName(); // would be the way to initialize a plugin
    this.buttons.forEach(button => {
      button.nativeElement.style.fontSize = '20px'; // simple DOM manipulation as a placeholder for plugin initialization
    });

    // 4. Responsive Post-Rendering Actions
    // This could be adjusting size or performing an animation based on the layout.
    // This example checks the rendered size of an element to make further style adjustments,
    // useful for dynamic layouts that need to react to their rendered environment.
    if (this.myDiv.nativeElement.offsetWidth > 200) {
      this.myDiv.nativeElement.style.fontSize = '24px';
    }
  }
}

// @@@ ExpressionChangedAfterItHasBeenCheckedError

// ngAfterViewInit is indeed the first lifecycle hook where @ViewChild and @ViewChildren queries are guaranteed to be resolved.
// You can safely access (i.e. READ) queried elements in ngAfterViewInit, and do manipulation which don't change them (such as putting focus).
// You can also safely MODIFY or CHANGE an element which is NOT bound (i.e. is NOT a part of data binding such as interpolation or property binding).
// However, MODIFYING them or CHANGING a bound element will lead to the ExpressionChangedAfterItHasBeenCheckedError.
// This is because Angular has already completed a change detection cycle when ngAfterViewInit is called.
// Angular wants to ensure that the view is stable after a change detection cycle.
// When you modify values in ngAfterViewInit, you're changing something after Angular thought it was done checking.

// The safe hook for manipulations after ngAfterViewInit is ngAfterViewChecked (will be described next).
// It's called after every change detection run, including the one that follows ngAfterViewInit.

// However, ngAfterViewChecked runs frequently, so you would still want to change a bound element in ngAfterViewInit to improve performance.
// There are a few ways to do that:

// 1. Wrap your manipulations in a setTimeout to schedule them for the next change detection cycle:
ngAfterViewInit() {
  setTimeout(() => {
    // Perform manipulations here
  });
}
// setTimeout() is a JavaScript function that allows you to schedule a piece of code to run after a specified delay:
setTimeout(function, delay, args[])
// - function: The code to be executed after the delay.
// - delay: The time (in milliseconds) to wait before executing the function.
// - args: Optional parameters to pass to the function.
// We are using the overload with the delay parameter is omitted, so value of 0 is used, meaning "execute in the next event cycle".
// The passed function will be placed in the event queue and executed after the current script has finished.

// 2. Manually trigger change detection after your manipulations useing ChangeDetectorRef.detectChanges():
constructor(private cdr: ChangeDetectorRef) {}

ngAfterViewInit() {
  // Perform manipulations here
  this.cdr.detectChanges();
}
// By calling detectChanges() in ngAfterViewInit, you're essentially running another change detection cycle before Angular's verification cycle.
// This allows Angular to "see" the updated values during its verification check.

// 3. Perform manipulations outside Angular's zone to avoid triggering change detection:
constructor(private ngZone: NgZone) {}

ngAfterViewInit() {
  this.ngZone.runOutsideAngular(() => {
    // Perform manipulations here
  });
}
// Angular's zone refers to the execution context managed by Zone.js, which Angular uses to track asynchronous operations and trigger change detection.
// Performing manipulations outside Angular's zone means executing code in a way that doesn't trigger Angular's change detection mechanism.
// Angular provides the NgZone service with methods like runOutsideAngular() to execute code outside its zone.

// ######################################################################################################
// * ngAfterViewChecked
// ######################################################################################################

// Called after each `ngAfterContentChecked` (first time - after `ngAfterViewInit`).
// Usage: Respond after Angular checks the component's views and child views, or the view that contains the directive.
// Useful for any post-view initialization or checks.

// The ngAfterViewChecked lifecycle hook is particularly useful for managing tasks that require verification or action
// after the change detection process has completed updates to the component's view and child views.

// Here’s an example that demonstrates updating external UI elements and ensuring visual consistency across component renders.
// Consider a scenario where you have a component that contains a dynamically resizing list of items.
// Each time the list changes, you want to adjust the size of a visual element to maintain a specific design constraint.

// The component template includes a list of items (<ul>) and a footer bar (<div>).
// These elements can dynamically change based on user actions or data updates.

import { Component, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-resizable-list',
  template: `
    <ul #listContainer>
      <li *ngFor="let item of items">{{ item }}</li>
    </ul>
    <div #footerBar>Footer Content Here</div>
  `,
  styles: [`
    ul { max-height: 300px; overflow-y: auto; }
    div { height: 50px; background-color: lightblue; }
  `]
})
export class ResizableListComponent implements AfterViewChecked {
  items = Array.from({ length: 10 }, (_, i) => `Item ${i + 1}`);
  @ViewChild('listContainer') listContainer: ElementRef;
  @ViewChild('footerBar') footerBar: ElementRef;

  constructor() {}

  // The adjustFooterPosition function reads the height of the list container.
  // Depending on its height, it dynamically adjusts the position of the footer.
  // If the list grows beyond a certain height, the footer is set to stick to the bottom of the viewport;
  // otherwise, it remains in the flow of the document (static positioning).
  // Ensures that the footer behaves correctly according to the list size, which might not be accurately measured until after the view is fully updated.
  adjustFooterPosition(): void {
    // Ensure the footer bar adjusts based on the list container's size
    const listHeight = this.listContainer.nativeElement.offsetHeight;
    if (listHeight > 250) {
      this.footerBar.nativeElement.style.position = 'absolute';
      this.footerBar.nativeElement.style.bottom = '0';
    } else {
      this.footerBar.nativeElement.style.position = 'static';
    }

    console.log('Footer position adjusted after view check');
  }
  
  // The ngAfterViewChecked hook calls the adjustFooterPosition method every time Angular completes checking the component's view and its child views.
  // This is important because any changes in the list's content or size may affect the layout,
  // and these changes need to be reflected in the footer's position.
  ngAfterViewChecked(): void {
    this.adjustFooterPosition();
  }
}

// @@@ Avoiding eternal recursion when changing bound elements

// ngAfterViewChecked a safe place to change elements which are a part of data binding such as interpolation or property binding
//		that would trigger ExpressionChangedAfterItHasBeenCheckedError in ngAfterViewInit.
// ngAfterViewChecked can impact performance since it runs frequently. Use it sparingly and with caution, only when absolutely necessary.

// If you modify a bound property here, you might trigger another change detection cycle, potentially leading to an infinite recursion.
// To prevent it, add a check to ensure you're not repeatedly setting the same value:
import { Component, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';

@Component({
  selector: 'app-example',
  template: `
    <input #inputElement [value]="inputValue">
    <p>Current value: {{ inputValue }}</p>
  `
})
export class ExampleComponent implements AfterViewChecked {
  @ViewChild('inputElement')
  inputElement!: ElementRef<HTMLInputElement>;
  
  inputValue = 'initial value'; // a property bound to an HTML element (<input>)
  #templateInitialized = false;

  ngAfterViewChecked() {
    if (!this.templateInitialized) {
      this.inputValue = <initialize it here>; // the next change detection cycle will copy the new value of this.inputValue to the <input> control
      this.templateInitialized = true; // prevent infinite recursion
    }
  }
}

// @@@ ngAfterViewChecked vs. ngAfterContentChecked

// The hooks ngAfterViewChecked and ngAfterContentChecked are quite similar, as both are involved in the change detection process
// and are called after every check of their respective areas of concern—content and view.
// However, they serve distinct purposes related to different parts of a component's rendering lifecycle.

// * ngAfterContentChecked:
//		Used for performing actions or responding to updates in the content that has been projected from a parent component to a child component. 
//		This might include reacting to changes in data that affect ng-content or adjusting component behavior based on the status of projected content.
//		Use ngAfterContentChecked when you need to react specifically to changes in content that might not necessarily involve
//		direct child components of the component but could include content that comes from outside the component.

// * ngAfterViewChecked:
//		Called after Angular checks the component’s view and the views of its child components.
//		It's a more encompassing hook that deals with the entire component tree from the point of view of the component where it is implemented.
//		Is ideal for tasks that require the DOM to be in a final state post-update.
//		It allows for handling post-render adjustments or operations that depend on the layout or properties of elements,
//		including child components that might have updated.
//		Use ngAfterViewChecked when you need to ensure that the whole component and its children are rendered and checked,
//		which is useful for final DOM manipulations or after rendering operations.

// ######################################################################################################
// * ngOnChanges
// ######################################################################################################

// Called each time a data-bound input property changes.
// Usage: Respond when Angular sets or resets data-bound input properties.
// Receives a `SimpleChanges` object containing the current and previous property values,
//		allowing developers to implement custom change detection logic or respond to changes in specific properties.

// ######################################################################################################
// * ngOnDestroy
// ######################################################################################################

// Called ONLY ONCE just before Angular destroys the directive or component.
// Usage: Cleanup just before Angular destroys the directive or component.
// Useful for unsubscribing from observables, detaching event handlers, and stopping interval timers to avoid memory leaks.

// ######################################################################################################
// Implementing interfaces
// ######################################################################################################

// As you noticed, each hook is defined by an interface having the same name as the hook but with no initial 'ng'.
// Technically, it's not a must to include "implements ..." in your component definition to use the lifecycle hook.
// However, it's considered a good practice to do so since declaring "implements ..." helps in two ways:
// * Type Checking:
//		If there's a typo in the hook name, TypeScript will throw an error since the hook, defined by the interface, is not implemented.
// * Code Readability:
//		It makes it clear to other developers (and to yourself) that this component is expected to implement the lifecycle hook.




