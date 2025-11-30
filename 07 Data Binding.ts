// Data binding in Angular is a powerful feature that allows you to synchronize data between the component class and the template.
// It's the mechanism that connects the application's data (stored in the component class) to the user interface (the HTML template) and vice versa.
// Changes in the data model are immediately reflected in the UI, and user interactions with the UI are immediately copied to the data model.

// Angular provides several types of data binding (to jump to a section, copy it with the asterisk, like "* @Output() - Event binding" -> Ctrl+F -> Ctrl+V).

// The arrow in the next diagrams shows the direction from the source to the target in which the data is transmitted - a change in the source is instantly reflected in the target.
// "Class" means the component's TypeScript class.
// "HTML" means the component's HTML template.

// Binding within the same component:

// * {{ }} - Interpolation (class ---> HTML)
// * [] - Property binding (class ---> HTML)
// * () - Event binding (HTML ---> class)
// * [(ngModel)] - Two-way data binding (class ---> HTML ---> class)

// Binding between parent and child components:

// * @Input() - Property binding (parent HTML ---> child class)
// * @Output() - Event binding (child class ---> parent HTML)

// ######################################################################################################
// ######################################################################################################
// Binding within the same component:
// ######################################################################################################
// ######################################################################################################

// ######################################################################################################
// * {{ }} - Interpolation (class ---> HTML)
// ######################################################################################################

// You can embed expressions (dynamic text) into HTML templates with double curly braces.
// They tell Angular that the text between them is an expression to evaluate rather than a hardcoded text to render as is.
// The value, returned by the expression, will be rendered in place of the braces and the expression.
// For example, the next HTML
2 + 2 = {{ 2 + 2 }}
// is rendered as "2 + 2 = 4".

// Interpolation is named so because it inserts (interpolates) dynamic values into static HTML, "filling the gaps" within the template.
// Interpolation automatically converts the expression's result into a string. Objects and arrays are converted using their toString method.
// In addition to evaluating the expression at first render, Angular also updates the rendered content when the expression's value changes.

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.css']
})
export class ExampleComponent {
  // 1. The data source - a scalar property of the component:
  firstName: string = 'John';
  lastName: string = 'Doe';

  // 2. The data source - an object property of the component:
  user: { email: string } = {
    email: 'john.doe@example.com'
  };

  // 3. The data source - a function of the component:
  getFullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}

// component.html:
<div>
  <p>1. Scalar property: {{ firstName }}</p>
  <p>2. Object property: {{ user.email }}</p>
  <p>3. Function: {{ getFullName() }}</p>
  <p>4. Expression: {{ firstName + ' ' + lastName + ' (' + firstName.charAt(0) + lastName.charAt(0) + ')' }}</p>
</div>

// The fourth line demonstrates a more complex expression within double curly braces. It will output: John Doe (JD).
// The expression can be any valid TypeScript expression that returns a value that can be converted to string.
// This includes a wide range of possibilities. Here are some examples to illustrate the breadth of what's possible:

// Simple arithmetic:
<p>{{ 2 + 2 }}</p>

// String manipulation:
<p>{{ firstName.toUpperCase() + ' ' + lastName.toLowerCase() }}</p>

// Boolean expressions:
<p>{{ age >= 18 ? 'Adult' : 'Minor' }}</p>

// Array operations:
<p>{{ ['apple', 'banana', 'cherry'].join(', ') }}</p>

// Object property access:
<p>{{ user?.address?.city || 'No city provided' }}</p>

// Function calls with arguments:
<p>{{ Math.max(score1, score2, score3) }}</p>

// Complex expressions:
<p>{{ isLoggedIn && user.roles.includes('admin') ? 'Welcome, Admin!' : 'Welcome, Guest!' }}</p>

// Template literal-style expressions (note: actual template literals are not supported, but you can achieve similar results):
<p>{{ `${firstName} ${lastName} is ${new Date().getFullYear() - birthYear} years old` }}</p>

// While these expressions can be quite complex, they should ideally be kept simple for readability and maintainability.
// If an expression grows too much, it's often better to compute the result in the component's TypeScript code and
//		then obtain it in the template with interpolation using a simple property or method call.
// Or you can use data cache after the initial calculation or retrieval of the value.

// These expressions are evaluated in the context of the component, so they have access to the component's properties and methods,
//		as well as to global objects like `Math`.

// These expressions should be pure and should not cause side effects, as Angular may re-evaluate them multiple times during change detection.

// @@@ When Are The Binding Mehods Called?

// Angular's change detection mechanism plays a key role in determining when to call the method and update the associated DOM property.
// It's responsible for ensuring the UI stays up-to-date with the underlying model state. Here's how it handles method calls in property bindings:

// * Change Detection Cycle:
//		Angular runs a change detection cycle at strategic points to check if any data bound properties have changed.
// * Method Binding:
//		If you bind a property of an HTML tag to a method in your component class, Angular will call this method during every change detection cycle
//		    to determine if the return value of the method has changed. If the return value changes, Angular updates the property in the HTML.

// Frequent Calls:
// Since Angular cannot know in advance when the return value of a method might change, it calls the method during each change detection cycle.
// If the method performs complex calculations or triggers other side effects, this can lead to performance issues.

// Optimization:
// It's generally better to store dynamic values as component properties and update these properties only when necessary.
// This way, during change detection, Angular only has to check the property value rather than execute a method.

// Best Practices

// Use Pure Pipes:
// If the transformation is purely data-driven and does not have side effects, consider using pipes, especially pure pipes,
// 		which Angular only calls when it detects a change in the input value.

// Avoid Complex Methods in Bindings:
// Keep methods used in bindings simple and quick to execute.
// Complex computations should be handled in the component's logic and stored in properties, not directly in the template expressions.

// Leverage OnPush Change Detection:
// For components with predictable data changes (e.g., data only changes via inputs), consider using the ChangeDetectionStrategy.OnPush 
//    to run change detection on these components only when their inputs change or when events originate from the component or its children.

// ######################################################################################################
// * [] - Property binding (class ---> HTML)
// ######################################################################################################

// Sets an HTML element's property value based on a component variable or a method. The syntax:
[html_property]="component_variable_or_method"
// The square brackets around an HTML property tell Angular that the string value is an expression to evaluate rather than a hardcoded text to render as is.
// The value, returned by the expression, will be rendered in place of the expression.

// Example (example.component.html):
<img [src]="image1Url" />
<img [src]="getImage2Url()" />

// During the rendering process, Angular will:
//		* remove the square brackets from the property name ("[src]" -> "src");
//		* evaluate the expression inside the quotes and use the result as the property value, substituting the expression.
// Suppose, image1Url CONTAINS "https://example.com/image1.png" and getImage2Url() RETURNS "https://example.com/image2.png". The rendered HTML:
<img src="https://example.com/image1.png" />
<img src="https://example.com/image2.png" />

// A method used in property binding cannot accept parameters!

// Property binding is not limited to strings; you can bind properties of various types such as numbers, booleans, objects, and arrays.
// The bound fields and methods can return a string or a type convertibe to string, but the final string must be appropriate (legal) for the property being bound to:
@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.css']
})
export class ExampleComponent {
  getPrice(): number {
    return 42;
  }
  
  calculationIsProhibited(): boolean {
    return true;
  }
  
  getStyles(): { [key: string]: string } {
    return {
      'font-size': '20px',
      'color': 'red'
    };
  }
  
  getClasses(): string[] {
    return ['class1', 'class2'];
  }
  
  getFontSize(): number {
    return 20;
  }

  getColor(): string {
    return 'red';
  }
}

// HTML template (example.component.html)::
<input id="price" [value]="getPrice()" />
<button id="calculate" [disabled]="calculationIsProhibited()">Calculate!</button>
<div [style.font-size.px]="getFontSize()" [style.color]="getColor()">Styled Text</div>
<div [ngStyle]="getStyles()">Another Styled Text</div>
<div [class]="getClasses().join(' ')">Class-bound Text</div>

// The final rendered HTML:
<input id="price" value="42">
<button id="calculate" disabled>Calculate!</button>
<div style="font-size: 20px; color: red;">Styled Text</div>
<div style="font-size: 20px; color: red;">Another Styled Text</div>
<div class="class1 class2">Class-bound Text</div>

// The [style.XXX] directive is used to bind a single CSS style property. So, it appears twice - for two the CSS style properties (font and color).

// The [ngStyle] directive is used to set multiple CSS styles at once by binding to an object, returned by the method.
// In that object, the keys are the CSS properties and the values are the styles you want to apply.
// Angular interprets [ngStyle] and applies all the styles contained in the object to the element. [ngStyle] is More elegant than a few [style.XXX] directives.

// Also, notice how getStyles() is defined:
  getStyles(): { [key: string]: string } {
// The type it returns
{ [key: string]: string }
// defines a key-value object with an arbitry number of pairs where both the keys and the values are strings.

// We could declare the function to return any:
  getStyles(): any {
// But this would be less specific and less type-safe.

// ------------------------------------------------------------------------------------------------------

// You may ask:
//    "Why to use Property binding like <img [src]="image1Url" /> instead of Interpolation like <img src="{{ image1Url }}" /> which must do the work?

// You're right that both property binding ([src]) and interpolation ({{ image1Url }}) can set attributes like src, and for simple cases, they often produce the same result.
// However, there are technical reasons why property binding is preferred in some situations.

// Property binding:

// 1. Binds to the DOM property, not the attribute
//       Interpolation writes to the HTML attribute (src="{{ image1Url }}"), which might not update the DOM property correctly in some edge cases.
//       [src] binds directly to the DOM property (img.src), which is what the browser actually uses for rendering.
//       So, Property binding improves performance: Angular can optimize rendering by only updating DOM elements affected by changed values, rather than re-rendering everything.

// 2. Avoids issues with non-string values
//       Interpolation always converts values to strings, while Property binding can handle non-string types properly.
//       For example, [disabled]="isDisabled" expects a boolean, while disabled="{{ isDisabled }}" sets it literally as "true" or "false", which is not the expected behavior.

// 3. Better for complex expressions
//       In Interpolation, if you include special characters (like quotes) or complex expressions, the syntax can become messy, hard to read and error-prone (or even break):
         <img src="/assets/{{ isThumbnail ? 'thumb.jpg' : 'full.jpg' }}" />
//       Property binding is more flexible and works fine:
         <img [src]="'/assets/' + (isThumbnail ? 'thumb.jpg' : 'full.jpg')" />

// 4. Is consistent with binding syntax in Angular
//       Using [prop] is consistent across all bindable properties, which can help readability and predictability in large codebases.

// In short, for property binding, just always use... Property binding!

// ######################################################################################################
// * () - Event binding (HTML ---> class)
// ######################################################################################################

// Components handle user interactions and respond to events such as button clicks, form submissions, and more.
// They can define event handlers in the component's class to execute specific actions or trigger changes in the application.

// The () syntax binds an HTML element's event (not a property!) to a method of the component class:

(html_event)="componentMethod()"

// The method is not executed on rendering - it will be executed only when the HTML event occurs.
// That is different from Property Binding where the method is executed on rendering in order to use its return as the initial value to build the HTML.

// Example:
<button (click)="saveData()">SAVE DATA</button>

// That is rendered as
<button>SAVE DATA</button>
// Ooops... Where is the saveData() method? It looks like event binding has gone!
// But how does Angular know which method of the component should be called when the button is clicked?
// No worries! When you write templates with event binding, Angular sets up event listeners for these events during the compilation and rendering phases.
// So, the component is constantly listening to the button's click event.
// When the user clicks the button, the event is propagated to that listener.
// This listener then calls saveData() on the component instance.

// The purpose of Event Binding method is only changing the component state.
// So, they must return void (technically, they can return any type, but the returned value will be ignored, and that return value will confuse).

// In contrast to Property Binding, Event Binding methods can accept parameters.
// They often use the special $event object to get information about the event that triggered the method:

export class ExampleComponent {
  onClick(event: MouseEvent): void {
    const clickedEl = event.target as HTMLElement;
    const id = clickedEl.id;
    const text = clickedEl.innerText;
    console.log('Button clicked!', { id, text });
  }
}

// HTML template (example.component.html):
<button id="btn1" (click)="onClick($event)">Click Me</button>

// The event's argument can be just a string. The following example demonstrates calling an event when an input control's value is changed by the user:

@Component({
  selector: 'app-user-name',
  templateUrl: './user-name.component.html',
  styleUrls: ['./user-name.component.css']
})
export class cstNameComponent {
  cstName: string = '';

  onKeyUp(newCstName: string): void { // <<<<<<<<<<<<<<<<<<<<<<<<< the event's argument is just a string
    this.cstName = newCstName;
  }
}

// HTML template (user-name.component.html):
<h1>{{ cstName }}</h1>
<input
  id="cstNameInput" 
  [value]="cstName"
  (keyup)="onKeyUp($event.target.value)"
  placeholder="Enter user name">

// We use event binding (keyup)="onKeyUp($event.target.value)" to call the onKeyUp method whenever a key is released in the input field.
// $event.target.value returns the current value of the input field, which we pass to the onKeyUp method.

// This setup creates a two-way binding between the input field and the cstName property.
// As the user types in the input field, the onKeyUp method is called, updating the cstName property,
// 		which in turn updates the displayed name in the <h1> tag.

// Note: It's often preferable to use the [(ngModel)] directive (described later in this file) for two-way binding if you're working with forms. 
// However, the approach shown here demonstrates how to handle events and update properties manually.
// That can be useful in certain scenarios or when you need more control over the binding process.

// It's also possible to use a template reference variable (a "pound variable") instead of $event.target.
// This approach is often clearer and more Angular-idiomatic since you can give the pound variable a name more meaningful than "$event.target".
// Here's how you would modify the <input> element in the template:

<input
  #enteredCstName
  id="cstNameInput" 
  [value]="cstName"
  (keyup)="onKeyUp(enteredCstName.value)"
  placeholder="Enter user name">

// The #enteredCstName declaration creates a reference to the input element, and then that reference is used in the (keyup) event binding.
// "enteredCstName.value" is much more self-documenting than "$event.target.value".

// ######################################################################################################
// * [(ngModel)] - Two-way data binding (class ---> HTML ---> class)
// ######################################################################################################

// A combination of Property Binding and Event Binding.
// Allows changes in the GUI to update the component's data, and vice versa, automatically and simultaneously.
// It's a powerful tool for creating interactive forms, providing an easy way to keep your component's data in sync with your template's form controls.

// In a typical scenario, the initial value of the bound property of the component class is displayed when the HTML is first rendered.
// If the user changes it in the browser, the bound property is automatically updated with the new value.
// Obviously, any changes of the bound property made by other parts of the program are reflected in the HTML right away.

// Syntax:
[(ngModel)]="the_bound_property"
// The square brackets denote the Property Binding part ("class ---> HTML").
// The round brackets denote the Event Binding part ("HTML ---> class").

// To use [(ngModel)], you need to import the FormsModule in your application root module (app.module.ts):
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
import { ParentComponent } from './app.component';
import { ExampleComponent } from './example/example.component';

@NgModule({
  declarations: [
    ParentComponent,
    ExampleComponent
  ],
  imports: [
    BrowserModule,
    FormsModule // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
  ],
  providers: [],
  bootstrap: [ParentComponent]
})
export class AppModule { }

// Example:

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html'
})
export class ExampleComponent {
  userEmail: string = 'fake@gmail.com';
}

// HTML Template (example.component.html):

<form>
  <div>
    <label for="email">Email:</label>
    <input id="email" name="email" type="email" [(ngModel)]="userEmail">
  </div>
  <p>Your email is: {{ userEmail }}</p>
</form>

// Rendered HTML:

<form>
    <label for="email">Email:</label>
    <input id="email" name="email" type="email" ng-reflect-model="">
  </div>
  <p>Your email is: fake@gmail.com</p>
</form>

// [(ngModel)]="userEmail" binds the input field to the userEmail property of the component class.

// You can see that [(ngModel)]="userEmail" is rendered as ng-reflect-model="".
// ng-reflect-model="" is just a stub attribute and does not reflect the real value.
// As with Event Binding, Angular creates listeners - [(ngModel)] actually wires up two-way binding under the hood.

// Notice that the bound variables can be used elsewhere in the template using Interpolation.
// For example, {{ userEmail }} displays the current value of the email property.

// When the form is rendered, the email input control is populated with the value of the userEmail field in the component object.
// And when the user types into the input field, that immediately changes the userEmail field in the component object.
// And that, respectively, is immediately reflected in the {{ userEmail }} piece of HTML (which uses Interpolation).

// The id, name and type attributes are part of standard HTML and are not related to [(ngModel)].

// @@@ Two-way binding with a getter / a setter:

// [(ngModel)] can bind not only with instance variables but also with getters / setters:
@Component({
  selector: 'app-example',
  templateUrl: './example.component.html'
})
export class ExampleComponent {
  private _userAge: number = 0;
  get userAge(): number { return this._userAge; }
  set userAge(value: number) { this._userAge = value < 0 ? 0 : value; }
}
// Usage:
<input [(ngModel)]="userAge" type="number">

// ######################################################################################################
// ######################################################################################################
// Binding between parent and child components:
// ######################################################################################################
// ######################################################################################################

// ######################################################################################################
// * @Input() - Property binding (parent HTML ---> child class)
// ######################################################################################################

// @Input() decorator denotes a child component's property as an input property.
// When you decorate a component's property with @Input(), you enable that property to receive values from its parent component.
// The parent HTML template passes the value using Property Binding (the square brackets syntax).

// Consider a simple Angular component that displays a user's name.
// The user's name is a property that the parent component can pass to this child component.

// Child Component:
import { Component, Input } from '@angular/core';
@Component({
  selector: "app-user",
  template: `<h1>Welcome, {{ nameInChild }}!</h1>`
})
export class ChildComponent {
  // Thanks to the @Input() decorator, the "nameInChild" property is designed to accept data from the component where it will be placed:
  @Input() nameInChild: string;
}

// Parent Component:
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class ParentComponent {
  nameInParent = 'John Doe'; // holds the value intended for the child
}

// Data binding from parent to child is specified in the Parent Component Template (app.component.html):
<div>
  <h2>This is the Parent Component!</h2>
  <app-user [nameInChild]="nameInParent"></app-user>
</div>

// You see that the input property of the child component ("nameInChild") is used as a property of the custom HTML tag specified in the child's selector (<app-user>).
// The value of ParentComponent.nameInParent ('John Doe') is assigned to ChildComponent.nameInChild.

// Remember this pattern well since you will use it in your real applications frequently!
// A typical scenario: you have a module's high-level component that renders the main screen structure.
// This component stores the module's core data and passes it to its child components (various parts of the screen) using property binding.
// For example, the main Customer component stores customerId and passes it to its child components - Address and Orders.
// The Customer component has:
public customerId: number;
// Both child components have:
@Input() contextCustomerId: number;
// In the HTML template of the Customer component:
<app-address [contextCustomerId]="customerId"></app-address>
<app-order-list [contextCustomerId]="customerId"></app-order-list>
// Then, the child components use the passed customerId as a retrieval parameter for their data.

// @@@ Required input

// To make an input property required, pass the
{ required: true }
// plain object to the @Input() decorator as a parameter.

// Example:
@Component({
  selector: 'app-child',
  template: `Name: {{name}}`
})
class ChildComponent {
  @Input({ required: true }) name: string;
}

// Let's say, you forget to provide a value for the name property from the parent template:
<app-child></app-child>
// That will throw an error: Required input 'name' from component ChildComponent must be specified.

// Notice that "required" means that it must appear in the parent component's template.
// It doesn't mean that the value is required - the parent template can legally sent null or undefined.

// @@@ Aliasing

// The @Input() decorator can accept a string parameter which is an alias of the property.
// Alias allows you to specify a different name for the input property - as it should appear in the template binding.
// This is useful when you want to use an internal property name within your component but expose a different name externally.
// In the next example, the child component uses "cstName" internally, but the parent populates it through the HTML attribute "customerName".

import { Component, Input } from '@angular/core';

@Component({
  selector: 'customer-profile',
  template: '<p>Customer Name: {{ cstName }}</p>'
})
export class CustomerProfileComponent {
  @Input('customerName') cstName: string;
}

// The field name is cstName, that's how it will be referenced in TypeScript.
// But the customerName alias becomes the property of the <customer-profile> custom HTML tag, not "cstName":
<customer-profile [customerName]="user.fullName"></customer-profile>

// This approach offers several benefits:
// * Allows you to have a more descriptive public API (HTML tag's property name) when the internal names are restricted by a naming convention
//		(for example, repeat abbreviated DB field names).
// * Can help avoid naming conflicts if the parent component already uses a property named cstName.
// * Provides flexibility in refactoring: you can change the internal property name without affecting how other components use your component.

// ######################################################################################################
// * @Output() - Event binding (child class ---> parent HTML)
// ######################################################################################################

// The @Output decorator allows child components to send data to their parent components - as the opposite of @Input().
// The bound property is typically of type EventEmitter<T> where <T> is the type of the data emitted to the parent component.

// Basic syntax:

// In the child component class:
@Output() eventEmitterInChild = new EventEmitter<T>();

// To send data outwards, call the emit() method of the EventEmitter:
this.eventEmitterInChild.emit(data);

// In the parent's template, use event binding to listen for the custom event:
<app-child (eventEmitterInChild)="reactToChildMessage($event)"></app-child>

// Example:

// Child component:
import { Component, Output, EventEmitter } from '@angular/core';
@Component({
  selector: 'app-child',
  template: '<button (click)="sendMessage()">Send Message</button>'
})
export class ChildComponent {
  @Output() eventEmitterInChild = new EventEmitter<string>();

  sendMessage() {
	  this.eventEmitterInChild.emit('Hello from child');
  }
}

// Parent component:
@Component({
  selector: 'app-parent',
  template: '<app-child (eventEmitterInChild)="reactToChildMessage($event)"></app-child>'
})
export class ParentComponent {
  reactToChildMessage(message: string) { console.log(message); }
}

// @@@ $event

// Review this line of the parent component:
  template: '<app-child (eventEmitterInChild)="reactToChildMessage($event)"></app-child>'
// $event is a special variable in Angular template syntax which represents the data emitted by the event.
// In our example, $event contains the string emitted by eventEmitterInChild in the child component.
// The parent's reactToChildMessage() method receives this string as its argument.

// The data type of $event is dictated by the T passed to EventEmitter<T>, which is string in our case:
  @Output() eventEmitterInChild = new EventEmitter<string>();

// However, it could be any type. In the next example, it's an object:

interface IUser {
  firstName: string;
  lastName: string;
}

// The child component:
import { Component, Output, EventEmitter } from '@angular/core';

// Remark: ngSubmit (in "template") is a directive which fires when the form is submitted; it will be described soon.
@Component({
  selector: 'app-user-form',
  template: `
    <form (ngSubmit)="onSubmit()">
      <input [(ngModel)]="userData.firstName" name="firstName" placeholder="First Name">
      <input [(ngModel)]="userData.lastName" name="lastName" placeholder="Last Name">
      <button type="submit">Submit</button>
    </form>
  `
})
export class UserFormComponent {
  @Output() userSubmitted = new EventEmitter<IUser>();

  user: IUser = {
    firstName: '',
    lastName: ''
  };

  onSubmit() {
    this.userSubmitted.emit(this.user); // the value passed will be available to the parent template as the $event variable
  }
}

// The parent component:

@Component({
  selector: 'app-parent',
  template: `
    <app-user-form (userSubmitted)="handleUserSubmission($event)"></app-user-form>
    <div *ngIf="submittedUser">
      Submitted User: {{submittedUser.firstName}} {{submittedUser.lastName}}
    </div>
  `
})
export class ParentComponent {
  submittedUser: IUser | null = null;

  handleUserSubmission(user: IUser) { // user contains the object, passed from the template as $event
    this.submittedUser = user;
    console.log('Received user data:', user);
  }
}

// @@@ ngSubmit

// Review this line:
    <form (ngSubmit)="onSubmit()">
// ngSubmit is a special event directive in Angular that is used in <form> elements with the event binding syntax.
// It fires when the form is submitted, either by clicking a submit button or by pressing Enter in a form input field.
// In this example, when the form is submitted, the onSubmit() method in that component is called, allowing you to handle the form data as needed.
// Advantages of (ngSubmit) over the standard DOM (submit):
// 		- prevents the default form submission behavior (which would cause a page reload);
// 		- works more reliably across different browsers;
// 		- integrates better with Angular's form handling mechanisms.

// ######################################################################################################
// Summary
// ######################################################################################################

// Within a single component:

// [] (Property binding): Binds data from component class to template elements
// () (Event binding): Listens for DOM events from template elements, triggering component class methods

// Between parent and child components:

// [] with @Input(): Parent passes data down to child
// () with @Output(): Child emits events up to parent

// The syntax looks identical visually, but the underlying mechanism differs. Single-component bindings connect the component with its own template.
// Parent-child bindings create communication channels between separate components through the Input/Output decorators.