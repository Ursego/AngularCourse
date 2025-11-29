// Structural Directives:
// * Bring to HTML the programming language-like functionality (such as "if", "else", "for", "switch").
// * Change the DOM layout (the structure of the view) by adding, removing, or manipulating DOM elements based on conditions.
// * Prefixed with an asterisk (*) (the OLD syntax) or with a pound (@) (the NEW syntax, starting from Angular 17).
// * Examples: *ngIf, *ngFor, *ngSwitch (the NEW syntax: @if, @for, @switch).
// * An element can have only one structural directive.

////////////////////////////////////////////////////////////////////////
// The OLD syntax //////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////

// ######################################################################################################
// *ngIf
// ######################################################################################################

// Conditionally includes an element in the DOM based on a Boolean expression.

// app.component.ts
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  showElement = true;
}

// app.component.html
<div *ngIf="showElement">
  This element is conditionally displayed.
</div>

// In this example, the `div` element will only be rendered if `showElement` is `true`.

// The rendered HTML:
<div>
  This element is conditionally displayed.
</div>

// If showElement would be false, the <div> element would not be rendered at all.

// Notice that *ngIf can evaluate not only a boolean variable but also a boolean function, for example:
<div *ngIf="isElementVisible()">
  This element is conditionally displayed.
</div>

// @@@ *ngIf as an object existence guard

// The next <div> will be rendered only if the object named 'user' is defined and instantiated, even if it's an empty object - {}:
<div *ngIf="user; else noUser">
  <h2>User Details</h2>
  <p>Name: {{user.name}}</p>
  <p>Email: {{user.email}}</p>
  <p>Age: {{user.age}}</p>
</div>

<ng-template #noUser>
  <p>Please login!</p>
</ng-template>
// The <div> will not be rendered if 'user' is undefined, null, or not declared at all.
// That makes *ngIf useful as a guard against accessing properties of undefined objects, which would cause errors if attempted.
// Notice that the "else templateVariable" pattern is very common in Angular templates which use the OLD syntax, so it's worth remembering.

// ######################################################################################################
// <ng-template> custom HTML tag to implement the "else" functionality
// ######################################################################################################

// <ng-template> you've just seen isn't a structural directive, but it's widely used with structural directives, so let's get familiar with it.

// The <ng-template> tag defines a piece of HTML (like <div>) but is not rendered by default.
// It's a container for an HTML block that Angular can conditionally add or remove from the DOM at runtime using structural directives.

// <ng-template> with an else condition in *ngIf is used to define content that should be displayed when the condition in *ngIf is false.
// It provides a way to specify alternative content without needing an additional *ngIf statement with the same condition negative.

// The pattern:

<div *ngIf="condition; else elseBlock">
  Content to show when condition is true
</div>

<ng-template #elseBlock>
  Content to show when condition is false
</ng-template>

// Example:

<div *ngIf="isLoggedIn; else loginButton">
  Welcome, {{username}}!
</div>

<ng-template #loginButton>
  <button (click)="login()">Login</button>
</ng-template>

// You can also use <ng-templat>e with `then` and `else`:
<div *ngIf="condition; then thenBlock else elseBlock"></div>
<ng-template #thenBlock>Content to render when condition is true.</ng-template>
<ng-template #elseBlock>Content to render when condition is false.</ng-template>
// This template keeps different code fragments, which have a same level of "logical nesting", at the same level of indentation.

// ######################################################################################################
// <ng-container> to be used instead of <div>
// ######################################################################################################

// <ng-container> is not a structural directive either, but it's widely used with structural directives, so let's learn it now.

// <ng-container> groups several elements together like <div> does.
// However, the <div> tag itself is rendered, while <ng-container> is not (only what is between <ng-container> and </ng-container>).
// That allows to apply structural directives to multiple elements or a fragment of a template without rendering unnecessary <div> wrapper elements.

// Why <ng-container> is often better than <div>:
// - It doesn't add an extra element to the DOM when the condition is true, keeping your HTML cleaner.
// - It doesn't affect styling or layout, unlike a <div> which might interfere with CSS.
// - It's more semantically correct when you don't need an actual container element.

// When you must use <div> rather than <ng-container>:
// - If you actually need a container element for styling or layout purposes.
// - If you're working with a third-party library that expects a real DOM element.

<ng-container *ngIf="isVisible; else notVisible">
  <h2>This content is visible</h2>
  <p>It shows when isVisible is true</p>
</ng-container>

<ng-template #notVisible>
  <h2>Alternative content</h2>
  <p>This shows when isVisible is false</p>
</ng-template>

// Notice that <ng-container> cannot define a template reference variable in the same way that <ng-template> can.
// While you can add a template reference variable to an <ng-container> like this
<ng-container #notVisible>
  <!-- content -->
</ng-container>
// #notVisible would point to the <ng-container> element itself, not to the code between <ng-template> and </ng-template>.
// This is why you must use <ng-template> when you need to define template (a piece of HTML) that can be referenced elsewhere.

// The new syntax (described soon) implicitly groups the content inside the directive block, so there is no need for <ng-container> anymore.

// ######################################################################################################
// *ngFor
// ######################################################################################################

// Repeats an element for each item in a list.

// beatles.component.ts
@Component({
  selector: 'beatles-root',
  templateUrl: './beatles.component.html',
  styleUrls: ['./beatles.component.css']
})
export class BeatlesComponent {
  beatles = ['Paul', 'John', 'George', 'Ringo'];
}

// beatles.component.html
<ul>
  <li *ngFor="let beatle of beatles">
    {{ beatle }}
  </li>
</ul>

// In this example, the `li` element will be repeated for each item in the `beatles` array and displayed as a list item.
// The rendered HTML:
<ul>
  <li>Paul</li>
  <li>John</li>
  <li>George</li>
  <li>Ringo</li>
</ul>

// @@@ index

// You can access the current loop index using the index variable:
<div *ngFor="let item of items; let i = index">
  <p>Index: {{ i }} - Item: {{ item.name }}</p>
</div>
// Notice that you cannot use the index var directly without declaring an alias variable (like i in the example) to hold its value within the *ngFor directive.

// @@@ trackBy

// Often, we loop over an array of objects which have a unique identifier field.
// That usually happens when the array is populated from a DB table, and the PK field is included in the data type.
// In that case, use trackBy to specify the function which returns the PK value for each item in the loop.
// When the change detection mechanism finds that the array has been changed, Angular re-renders the HTML element (<ul> in our example).
// trackBy improves performance by helping Angular identify which items have changed and re-render only them - instead of re-rendering the entire list.

type User = {
  id: number;
  name: string;
};

@Component({
  selector: 'app-user-list',
  template: `
    <ul>
      <li *ngFor="let user of users; trackBy: getCurrUserId">
        {{ user.name }}
      </li>
    </ul>
  `
})
export class UserListComponent {
  users: User[] = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' }
  ];

  getCurrUserId(index: number, user: User): number {
    return user.id;
  }
}

// Angular’s *ngFor directive expects a trackBy function (like getCurrUserId in the example) to match the following signature:
(index: number, item: T) => any
// The function receives two parameters, automatically supplied by Angular on each iteration:
//   index: The current item's index in the iteration
//   item: The current item from the array being iterated

// @@@ <ng-container> with *ngFor
// You can use *ngFor with <ng-container> instead of <div>:
<ng-container *ngFor="let item of items">
  <div>{{ item }}</div>
</ng-container>

// Example of nested <ng-container> tags for multiple structural directives:
<ng-container *ngIf="isLoggedIn">
  <ng-container *ngFor="let item of items">
    <div>{{ item }}</div>
  </ng-container>
</ng-container>

// ######################################################################################################
// [ngSwitch]
// ######################################################################################################

// Conditionally includes one of several possible elements based on a switch expression.
// The expressions to match are provided by *ngSwitchCase directives. Every view that matches is rendered.
// If there are no matches, a view with the *ngSwitchDefault directive is rendered.

<div [ngSwitch]="favoriteFruit">
  <div *ngSwitchCase="apple">Apple is selected!</div>
  <div *ngSwitchCase="banana">Banana is selected!</div>
  <div *ngSwitchCase="cherry">Cherry is selected!</div>
  <div *ngSwitchDefault>No fruit selected.</div>
</div>

// The rendered HTML if favoriteFruit is "cherry":
<div>
  <div>Cherry is selected!</div>
</div>

// @@@ Example of using <ng-container> rather than <div>:

<ng-container [ngSwitch]="favoriteFruit">
  <ng-container *ngSwitchCase="apple">Apple is selected!</ng-container>
  <ng-container *ngSwitchCase="banana">Banana is selected!</ng-container>
  <ng-container *ngSwitchCase="cherry">Cherry is selected!</ng-container>
  <ng-container *ngSwitchDefault>No fruit selected.</ng-container>
</ng-container>

// Notice that Angular implements a switch mechanism using the [ngSwitch] directive on a container element, not *ngSwitch.
// The asterisk (*) syntax is reserved for structural directives that add or remove host elements from the DOM,
//    and in the case of ngSwitch, only the case and default parts are structural.

////////////////////////////////////////////////////////////////////////
// The NEW syntax //////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////

// The new control flow syntax (@if/@else, @for/@empty, @switch/@case/@default) was introduced in Angular 17, which was released on November 8, 2023.
// This was a significant update to Angular's template syntax, aiming to make templates more intuitive, readable and efficient.

// ######################################################################################################
// @if
// ######################################################################################################

@if (condition1) {
  <p>Condition 1 is true</p>
} @else if (condition2) {
  <p>Condition 2 is true</p>
} @else {
  <p>All conditions are false</p>
}

// Replaces the old syntax:

<p *ngIf="condition1">Condition is true</p>
<p *ngIf="!condition1 && condition2">Another condition is true</p>
<p *ngIf="!condition1 && !condition2">All conditions are false</p>

// Key differences:
// - Using { }, like in many programming languages, allows for more readable, block-style conditionals
// - Easier to handle multiple conditions with @else if
// - No need for <ng-template> for else conditions

// ######################################################################################################
// @for
// ######################################################################################################

// https://blog.angular-university.io/angular-for/

@for (item of items; track item.id) {
  <p>{{item.name}}</p>
} @empty {
  <h2>No items found</h2>
}

// The @empty section specifies what will be rendered if the array is empty.

// Replaces the old syntax:

<p *ngFor="let item of items; trackBy: trackByFn">{{item.name}}</p>
<p *ngIf="items.length === 0">No items found</p>

// Key differences:
// - Simpler syntax for trackBy functionality
// - Built-in empty state handling with @empty - no need for separate *ngIf for empty state

// @@@ $index

// You can access the current loop index using the $index variable (using an alias var like in the old syntax):
<div @for="let item of items; let i = $index">
  <p>Index: {{ i }} - Item: {{ item.name }}</p>
</div>
// Notice that the $index variable has the dollar sign - in contrast to the old syntax.

// @@@ track
// A simplified way to specify a unique identifier for each item in the loop.
// Serving the same purpose as `trackBy` in the old syntax but with no need to create a trackBy...() function - the unique property is mentioned directly.

// In the new syntax, track is mandatory - in contrast to trackBy in the old syntax.
// If you forget it, you will get the "NG5002: @for loop must have a "track" expression" error.

// What if there is nothing unique about the looped elements?
// Simply use $index as a "unique field":
<ul>
  @for (let num of nums; track $index) {
    <li>Number: {{ num }}</li>
  }
</ul>
// Notice that you cannot write "track num" since the values are not guaranteed to be unique.

// ######################################################################################################
// @switch
// ######################################################################################################

@switch (condition) {
  @case (value1) {
    <p>Value is 1</p>
  }
  @case (value2) {
    <p>Value is 2</p>
  }
  @default {
    <p>Value is neither 1 nor 2</p>
  }
}

// Replaces the old syntax:

<div [ngSwitch]="condition">
  <p *ngSwitchCase="value1">Value is 1</p>
  <p *ngSwitchCase="value2">Value is 2</p>
  <p *ngSwitchDefault>Value is neither 1 nor 2</p>
</div>


// General advantages of the new syntax:
// 1. More intuitive and closer to standard programming constructs
// 2. Improved type checking and error detection at compile-time
// 3. Better performance due to optimized change detection
// 4. Easier to read and maintain, especially for complex templates
// 5. Reduced need for auxiliary variables in templates

// While these new control flow syntax options provide improvements, the older syntax is still supported for backwards compatibility.
// Developers can choose to adopt the new syntax gradually in their projects.