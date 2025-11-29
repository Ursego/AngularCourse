// ######################################################################################################
// Angular Template Reference Variables: A Comprehensive Guide
// ######################################################################################################

// ### Introduction

// Template Reference Variables are a powerful feature that allows you to directly reference elements, components, or directives in your template.
// They provide a way to interact with and manipulate these elements from within the template or component class.

// ### Basic Syntax

// To create a template reference variable, use the hash (#) symbol followed by a name:

<element #variableName></element>

// ### Usage

// Referencing in the Template

// You can use the variable anywhere in the template after it's declared:
<input #nameInput type="text">
<button (click)="greet(nameInput.value)">Greet</button>

// Referencing in the Component Class

// To access an HTML element in TypeScript, use the @ViewChild decorator (you will learn it in detail soon), passing the variable name (with no #) as an argument:

import { Component, ViewChild, ElementRef } from '@angular/core';

@Component({...})
export class MyComponent {
  @ViewChild('nameInput') nameInput!: ElementRef; // <<<<<<<<<<<<<<<<<<<<<<<<

  ngAfterViewInit() {
    console.log(this.nameInput.nativeElement.value);
  }
}

// ### Types of References

// DOM Elements

// When used on a standard HTML element, the variable refers to the DOM element:
<div #greetingDiv>Hello</div>

// Components

// When used on a component, the variable refers to the component instance:
<app-child #childComp></app-child>

//  Directives

// When used with directives, you can access the directive instance:
<div #myTooltip="matTooltip" matTooltip="Hello">Hover me</div>

// TemplateRef

// When used on an `<ng-template>`, it creates a reference to a TemplateRef:
<ng-template #myTemplate>
  <p>Template content</p>
</ng-template>

// ### Advanced Usage

// With *ngFor

// You can use template variables within *ngFor loops:
<div *ngFor="let item of items; let i = index; #itemElement">
  {{i}}: {{item}}
</div>

// Inputs to Components

// You can pass template variables as inputs to other components:
<input #nameInput type="text">
<app-greeting [name]="nameInput.value"></app-greeting>

// ### Limitations

// * You cannot use a variable before it's declared in the template.
// * Template variables are only available within its template.
//      They are not accessible in parent components unless explicitly passed through an input property or a @ViewChild decorator.

// ATTENTION! Avoid overusing template variables for complex logic; move it to the component class when appropriate.

// ######################################################################################################
// Pipes (for Templates)
// ######################################################################################################

// REMARK: Not to be confused with the pipe() function of RxJS Observables that combines and chains multiple RxJS operators together, which you will learn later!

// Angular Pipes are used in templates to modify how data is displayed (for example, formatting dates, numbers, or applying custom filters).
// Pipes take in data as input and transform it to a desired output format.
// They are used to display formatted data in the view without having to write complex logic in the component itself.

// You apply pipes directly in the template using | (the pipe operator):
{{ expression | pipeName }}

// You can also pass arguments to a pipe by separating them with colons:
{{ expression | pipeName:arg1:arg2 }}

// @@@ Built-in Pipes:

// Angular comes with several built-in pipes like DatePipe, UpperCasePipe, LowerCasePipe, CurrencyPipe, PercentPipe etc.

@Component({
  selector: 'app-pipe-example',
  template: `
    <p>Original string: {{ title }}</p>
    <p>Uppercase: {{ title | uppercase }}</p>
    <p>Lowercase: {{ title | lowercase }}</p>
    <p>Formatted date: {{ today | date:'fullDate' }}</p>
    <p>Currency format: {{ price | currency:'USD':true }}</p>
  `
})
export class PipeExampleComponent {
  title = 'Angular Pipes Example';
  today = new Date();
  price = 199.99;
}

// Explanation:

// Uppercase Pipe (uppercase): Converts a string to uppercase.
{{ title | uppercase }}
// transforms 'Angular Pipes Example' to 'ANGULAR PIPES EXAMPLE'.

// Lowercase Pipe (lowercase): Converts a string to lowercase.
{{ title | lowercase }}
// transforms 'Angular Pipes Example' to 'angular pipes example'.

// Date Pipe (date): Formats a date according to the specified format.
{{ today | date:'fullDate' }}
// formats the today variable to a full date string, such as 'Monday, January 1, 2024'.

// Currency Pipe (currency): Formats a number as currency.
{{ price | currency:'USD':true }}
// formats 199.99 as $199.99, with the currency symbol (USD for US dollars).

// @@@ Custom Pipes:

// You can also create your own pipes to handle custom transformations that are not covered by the built-in pipes.
// Pipe is a class which:
//    1. Has the @Pipe decorator.
//    2. Implements the PipeTransform interface which has only one method - transform(). The method takes an original value and returns the transformed value.

// Suppose you want to create a custom pipe that reverses a string.
// The naming convention is <Description>Pipe, so ours will be ReversePipe.

// 1. Generate a new pipe using Angular CLI:
ng generate pipe reverse

// 2. Modify the generated `reverse.pipe.ts` file:

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'reversePipe' })
export class ReversePipe implements PipeTransform {
	transform(value: string): string {
		return value.split('').reverse().join('');
	}
}

// 3. Use the custom pipe in a component template:

import { Component } from '@angular/core';

@Component({
	selector: 'app-custom-pipe-example',
	template: `
   <p>Original string: {{ title }}</p>
   <p>Reversed string: {{ title | reversePipe }}</p>
 `
})
export class ReversePipeExampleComponent {
	title = 'Angular Pipes Example';
}

// @@@ Custom Pipe with a Parameter

// Here is how the transform() method is defined in the PipeTransform interface:

export interface PipeTransform {
    transform(value: any, ...args: any[]): any;
}

// Its first parameter is the value to transform (which is on the lefthand side of the pipe symbol).
// The second parameter is an array of values that the template can provide as parameters.

// Here’s a simple example of a custom pipe that accepts a parameter.
// This pipe will take a string and repeat it a specified number of times.

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'repeatPipe' })
export class RepeatPipe implements PipeTransform {
  transform(value: string, times: number): string {
    return value.repeat(times);
  }
}

// Pass the parameter from the template:
<p>Original string: {{ title }}</p>
<p>Repeated string: {{ title | repeatPipe:3 }}</p>

// @@@ Registering Custom Pipe in the Module

// Make sure the pipe is registered in your Angular module (app.module.ts or the module where you intend to use it):

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReversePipe } from './reverse.pipe';
import { ReversePipeExampleComponent } from './reverse-pipe-example.component';
import { RepeatPipe } from './repeat.pipe';
import { RepeatPipeExampleComponent } from './repeat-pipe-example.component';

@NgModule({
  declarations: [
    RepeatPipe, // <<<<<<<<<<<<<<<<<<<<<<<
    RepeatPipeExampleComponent,
    ReversePipe, // <<<<<<<<<<<<<<<<<<<<<<<
    ReversePipeExampleComponent
  ],
  imports: [BrowserModule],
  bootstrap: [RepeatPipeExampleComponent]
})
export class AppModule { }