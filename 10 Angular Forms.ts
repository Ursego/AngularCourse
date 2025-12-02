// ######################################################################################################
// Angular Forms
// ######################################################################################################

// Angular Forms is a module in Angular that provides functionality for building, managing, and validating forms in web applications.
// It offers a way to create interactive and dynamic forms that can respond to user input and provide validation feedback.

// Key Features:
// * Form Validation: Provides built-in validation features (e.g., required, minlength, pattern) and allows custom validators.
// * Form Controls: Handles form controls (FormControl, FormGroup, FormArray) and tracks their state (valid, invalid, touched, dirty, etc.).
// * Two-way Data Binding: Synchronizes form input fields with component data in template-driven forms.
// * Dynamic Forms: Allows for programmatic creation and validation of forms in reactive forms.

// Angular Forms supports two main approaches:

// 1. Template-Driven Forms:

// Uses Angular’s two-way data binding - ngModel - and works mainly within the template (HTML).
// Best for simpler forms, where most of the logic is embedded in the template.
// Example:

<form #form="ngForm">
  <input name="username" ngModel required>
  <input type="submit" [disabled]="form.invalid">
</form>

// Key Features:
// * Relies on directives like ngModel to bind data between the form and the component.
// * Easier to use for simple forms but less scalable for more complex form structures.

// 2. Reactive Forms:

// Uses a more programmatic, reactive approach, where the form structure and logic are defined in the component class.
// Best for complex forms, dynamic form generation, or forms with heavy validations.
// Example:

import { FormGroup, FormControl, Validators } from '@angular/forms';

export class MyFormComponent {
  fg = new FormGroup({
    username: new FormControl('', Validators.required)
  });
}

// Template:

<form [fg]="form">
  <input formControlName="username">
  <button [disabled]="form.invalid">Submit</button>
</form>

// Key Features:
// * Offers more control over form data and validation logic.
// * Works well with dynamic forms and provides fine-grained control over form state.

// ######################################################################################################
// Form Control States
// ######################################################################################################

// In Angular's form handling, "touched," "dirty," and "valid" are important form states that help track user interaction and validate input.
// These states are fundamental to creating responsive forms with appropriate validation feedback.

// @@@ touched / untouched:

// A form control is "untouched" originally and becomes "touched" when the user has focused on it (clicked or tabbed to it) and then moved focus away.

// @@@ dirty / pristine

// A form control is "pristine" originally and becomes "dirty" when its value has been changed by the user.

// A "dirty" control remains "dirty" even if the original value was restored.
// If you need to track whether the current value matches the initial value, you would need to implement that comparison logic separately.
// If you want to reset a control's state (including making it pristine again), you would need to explicitly call the markAsPristine() method or the reset() method on the control.

// @@@ valid / invalid

// A form control is considered "valid" when it meets (passes) all the validation rules applied to it.
// Becomes "invalid" if any validator fails.
// A form group is "valid" only when all its child controls are "valid".

// ######################################################################################################
// ValidationErrors
// ######################################################################################################

// ValidationErrors is a key concept for handling and representing form validation errors.
// Represents validation errors returned from failed validation checks in form controls.
// It's essentially a simple Map-like object where each key represents a specific type of error, and its value is
//      either true or an object with additional error details.

type ValidationErrors = {
    [key: string]: any;
};

// Angular's built-in validators return ValidationErrors objects when validation fails.
// When creating custom validators, you should return null for valid inputs and a ValidationErrors object for invalid inputs.

// Accessing Errors:
// You can access validation errors through the 'errors' property of a FormControl, FormGroup, or FormArray.

// Examples of ValidationErrors objects:

// Required field error:
{ required: true }
// min error:
{ min: { min: 10, actual: 5 } }
// MinLength error:
{ minlength: { requiredLength: 5, actualLength: 3 } }
// Pattern error:
{ pattern: { requiredPattern: '^[a-zA-Z ]*$', actualValue: '123' } }
// Custom error:
{ customError: { message: 'This field is invalid' } }

// Usage in component:
ngOnInit() {
  this.form = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)])
  });
}

get nameErrors(): ValidationErrors | null {
  return this.form.get('name')?.errors;
}

// Usage in template:
<input formControlName="name">
<div *ngIf="nameErrors">
  <p *ngIf="nameErrors['required']">Name is required.</p>
  <p *ngIf="nameErrors['minlength']">Name must be at least {{nameErrors['minlength'].requiredLength}} characters.</p>
</div>

// ######################################################################################################
// ValidatorFn & AsyncValidatorFn
// ######################################################################################################

// ValidatorFn is a function that receives a control and synchronously returns a map of validation errors if present, otherwise null.

interface ValidatorFn {
  (control: AbstractControl<any, any>): ValidationErrors | null
}

// AsyncValidatorFn is a function that receives a control and returns a Promise or observable that emits validation errors if present, otherwise null.

interface AsyncValidatorFn {
  (control: AbstractControl<any, any>): Promise<ValidationErrors | null> | Observable<ValidationErrors | null>
}

// ######################################################################################################
// Validators
// ######################################################################################################

// The Validators class is a collection of predefined validators used to ensure that form controls meet specific conditions.
// It provides common validation rules such as required fields, minimum and maximum values, pattern matching, and more.
// These validators can be applied to individual form controls or groups in both template-driven and reactive forms.

// A few examples of Properties and Functions of the Validators Class:

// 1. required:
// Ensures that the form control has a value (i.e., the field cannot be empty).
const control = new FormControl('', Validators.required); // the 1st parameter to FormControl constructor is the initial value

// 2. min:
// Ensures that the form control's value is greater than or equal to a specified minimum number.
const control = new FormControl('', Validators.min(10));

// 3. max:
// Ensures that the form control's value is less than or equal to a specified maximum number.
const control = new FormControl('', Validators.max(100));

// 4. minLength():
// Ensures that the form control's value has at least the specified minimum number of characters.
const control = new FormControl('', Validators.minLength(5));

// 5. maxLength():
// Ensures that the form control's value has no more than the specified maximum number of characters.
const control = new FormControl('', Validators.maxLength(10));

// 6. pattern():
// Ensures that the form control's value matches a specified regular expression pattern.
const control = new FormControl('', Validators.pattern('^[a-zA-Z]+$')); // only letters allowed

// 7. email:
// Validates that the control's value is in a valid email format (following RFC 5322 standard).
const control = new FormControl('', Validators.email);

// You can apply validators when creating form input controls like this:
import { FormControl, Validators } from '@angular/forms';

const username = new FormControl('', [
  Validators.required,
  Validators.minLength(6),
  Validators.maxLength(20)
]);
// These validators are applied to the form control, and the form becomes invalid if any of the conditions are not met.
// Each validator returns an error object if validation fails or null if it succeeds.

// If validations are optional, i.e. applied or not applied depending on runtime conditions, then firstly create an array of validators according to your needs:
const usernameValidators = (this.loginThroughGoogleOrSocialMedia()) ? [] : [
  Validators.required,
  Validators.minLength(6),
  Validators.maxLength(20)
];
// Then, pass that array to the FormControl's constructor:
const username = new FormControl('', usernameValidators);

// Validators example:

import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-validators-example',
  templateUrl: './validators-example.component.html'
})
export class ValidatorsExampleComponent {
  formGroup = new FormGroup({ // FormGroup represents a group of form controls, will be described soon
    age: new FormControl('', [Validators.required, Validators.min(18), Validators.max(65)]),
    username: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(10)]),
    name: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z]+$')]),
    email: new FormControl('', [Validators.required, Validators.email]),
  });
}

// HTML Template (validators-example.component.html):

<form [formGroup]="formGroup">
  <div>
    <label for="age">Age (between 18 and 65):</label>
    <input id="age" type="number" formControlName="age">
    <div *ngIf="formGroup.get('age')?.invalid && formGroup.get('age')?.touched">
      <div *ngIf="formGroup.get('age')?.hasError('required')">Age is required</div>
      <div *ngIf="formGroup.get('age')?.hasError('min')">Minimum age is 18</div>
      <div *ngIf="formGroup.get('age')?.hasError('max')">Maximum age is 65</div>
    </div>
  </div>

  <div>
    <label for="username">Username (3-10 characters):</label>
    <input id="username" type="text" formControlName="username">
    <div *ngIf="formGroup.get('username')?.invalid && formGroup.get('username')?.touched">
      <div *ngIf="formGroup.get('username')?.hasError('required')">Username is required</div>
      <div *ngIf="formGroup.get('username')?.hasError('minlength')">Username must be at least 3 characters</div>
      <div *ngIf="formGroup.get('username')?.hasError('maxlength')">Username cannot exceed 10 characters</div>
    </div>
  </div>

  <div>
    <label for="name">Name (letters only):</label>
    <input id="name" type="text" formControlName="name">
    <div *ngIf="formGroup.get('name')?.invalid && formGroup.get('name')?.touched">
      <div *ngIf="formGroup.get('name')?.hasError('required')">Name is required</div>
      <div *ngIf="formGroup.get('name')?.hasError('pattern')">Only alphabetic characters are allowed</div>
    </div>
  </div>

  <div>
    <label for="email">Email:</label>
    <input id="email" type="email" formControlName="email">
    <div *ngIf="formGroup.get('email')?.invalid && formGroup.get('email')?.touched">
      <div *ngIf="formGroup.get('email')?.hasError('required')">Email is required</div>
      <div *ngIf="formGroup.get('email')?.hasError('email')">Please enter a valid email</div>
    </div>
  </div>

  <button [disabled]="formGroup.invalid">Submit</button>
</form>

// ######################################################################################################
// AbstractControl
// ######################################################################################################

// AbstractControl is the base class for all forms controls in Angular's reactive forms module.
// It represents the core functionality that is shared between different types of form controls, such as FormControl, FormGroup, and FormArray.
// It provides the basic functionality for form controls, such as tracking their value, validity, and user interactions.

// Types of Form Controls that Extend AbstractControl:
// * FormControl: Represents a single form input (such as a text box).
// * FormGroup: Represents a group of form controls, allowing you to treat multiple controls as a single unit.
// * FormArray: Represents an array of form controls, useful for dynamic forms.

// AbstractControl's constructor:
constructor(validators: ValidatorFn | ValidatorFn[], asyncValidators: AsyncValidatorFn | AsyncValidatorFn[]) {}
// Each parameter is a function or array of functions used to determine the validity of this control synchronously and asynchronously.

// Properties and methods of AbstractControl are described here: https://angular.dev/api/forms/AbstractControl

// ######################################################################################################
// FormControl
// ######################################################################################################

// https://v17.angular.io/api/forms/FormControl

// FormControl is a fundamental class in Angular's Reactive Forms module that represents a single field.
// It manages the value, validation, and state (such as touched, dirty, valid, etc.) of the form control.
// FormControl is typically used to create and manage form inputs programmatically,
//         either as standalone controls or as part of a form group or form array.

// Key Properties of FormControl:
// value: The current value of the form control.
// valid: Whether the control’s value is valid based on the associated validators.
// touched: Whether the control has been interacted with.
// dirty: Whether the control’s value has been changed by the user.
// errors: Any validation errors present in the control.

// Note that FormControl accepts a type parameter that specifies the type of data it holds (FormControl<T>), enhancing type safety.

import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-example-form',
  templateUrl: './example-form.component.html'
})
export class ExampleFormComponent {
  nameControl = new FormControl<string>('', [Validators.required, Validators.minLength(3)]);
  ageControl = new FormControl<number | null>(null, [Validators.required, Validators.min(18)]);
  birthDateControl = new FormControl<Date | null>(null, Validators.required);
  genderControl = new FormControl<string>('');
  acceptTermsControl = new FormControl<boolean>(false, Validators.requiredTrue); // not just a required but must be True

  allControllsAreValid(): boolean {
    return this.nameControl.valid && this.ageControl.valid && this.birthDateControl.valid && this.genderControl.valid && this.acceptTermsControl.valid;
  }

  onSubmit() {
    if (this.allControllsAreValid()) {
      console.log({
        name: this.nameControl.value,
        age: this.ageControl.value,
        birthDate: this.birthDateControl.value,
        gender: this.genderControl.value,
        acceptTerms: this.acceptTermsControl.value
      });
    }
  }
}

// HTML Template:

<form (ngSubmit)="onSubmit()">
  <!-- Text Input -->
  <label>Name:</label>
  <input type="text" formControlName="nameControl">
  <div *ngIf="nameControl.invalid && nameControl.touched">
    Name is required and must be at least 3 characters.
  </div>

  <!-- Number Input -->
  <label>Age:</label>
  <input type="number" formControlName="ageControl">
  <div *ngIf="ageControl.invalid && ageControl.touched">
    You must be at least 18 years old.
  </div>

  <!-- Date Input -->
  <label>Birth Date:</label>
  <input type="date" formControlName="birthDateControl">
  <div *ngIf="birthDateControl.invalid && birthDateControl.touched">
    Please select a valid birth date.
  </div>

  <!-- Radio Buttons -->
  <label>Gender:</label>
  <label>
    <input type="radio" formControlName="genderControl" value="male"> Male
  </label>
  <label>
    <input type="radio" formControlName="genderControl" value="female"> Female
  </label>
  <div *ngIf="genderControl.invalid && genderControl.touched">
    Please select your gender.
  </div>

  <!-- Checkbox -->
  <label>
    <input type="checkbox" formControlName="acceptTermsControl"> I accept the terms and conditions
  </label>
  <div *ngIf="acceptTermsControl.invalid && acceptTermsControl.touched">
    You must accept the terms.
  </div>

  <!-- Submit Button -->
  <button type="submit" [disabled]="!allControlsAreValid()">Submit</button>
</form>

// ######################################################################################################
// FormGroup
// ######################################################################################################

// https://v17.angular.io/api/forms/FormGroup

// FormGroup is a class in Angular's Reactive Forms module that groups multiple FormControl-s into a single unit.
// It's used to represent a collection of form controls that logically belong together, such as the fields of a form.
// By grouping controls, Angular allows you to manage the validation, status, and values of multiple form controls at once.

// Key Features of FormGroup:
// * Manages multiple form controls:
//         A FormGroup is an object that contains multiple FormControl instances or even other FormGroup or FormArray instances.
// * Tracks the form state:
//         It tracks the state (valid, invalid, dirty, touched, etc.) of all its child controls.
// * Manages the form’s value:
//         A FormGroup allows you to get or set the entire form’s value as a Map object,
//            where the keys are the control names and the values are the form control values.
// * Validation:
//         You can add synchronous or asynchronous validators to a FormGroup to manage the validation of the entire group of controls.

// Its constructor accepts a Map where the keys are control names (strings) and the values are instances of FormControl, FormGroup, or FormArray.

// Let’s say you have a form with fields for a user's name, age, and email.
// Define a FormGroup in the Component:

import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html'
})
export class UserFormComponent {
  // Define the form group
  userForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    age: new FormControl(null, [Validators.required, Validators.min(18)]),
    email: new FormControl('', [Validators.required, Validators.email])
  });

  // Handle form submission
  onSubmit() {
    if (this.userForm.valid) { // no need to check each control individually as we did earlier in the FormControl example
      console.log(this.userForm.value);
    }
  }
}

// The Template fragment for the Form:

<form [formGroup]="userForm" (ngSubmit)="onSubmit()">
  <div>
    <label for="name">Name:</label>
    <input id="name" formControlName="name">
    <div *ngIf="userForm.get('name').invalid && userForm.get('name').touched">
      Name is required and must be at least 3 characters.
    </div>
  </div>

  <div>
    <label for="age">Age:</label>
    <input id="age" type="number" formControlName="age">
    <div *ngIf="userForm.get('age').invalid && userForm.get('age').touched">
      You must be at least 18 years old.
    </div>
  </div>

  <div>
    <label for="email">Email:</label>
    <input id="email" formControlName="email">
    <div *ngIf="userForm.get('email').invalid && userForm.get('email').touched">
      Please enter a valid email address.
    </div>
  </div>

  <button type="submit" [disabled]="userForm.invalid">Submit</button>
</form>

// You can retrieve the values of the entire FormGroup as a plain TypeScript object:
console.log(this.userForm.value); // output: { name: '', age: null, email: '' }

// You can set the values of the entire group programmatically:
this.userForm.setValue({
  name: 'John Doe',
  age: 25,
  email: 'john.doe@example.com'
});

// If you only want to set some values and leave others unchanged, use patchValue instead of setValue:
this.userForm.patchValue({
  name: 'Jane Doe'
});

// You can check if the form is valid, invalid, touched, dirty, etc.:
if (this.userForm.valid) {
  console.log('Form is valid');
}

// You can reset the form, which clears all values and sets the controls back to their initial states:
this.userForm.reset();

// @@@ Nested FormGroup:

// You can nest FormGroup instances inside other FormGroup instances to logically group controls.
// Let’s say you want to create a form with user information and address fields:

userForm = new FormGroup({
  personalInfo: new FormGroup({
    name: new FormControl(''),
    age: new FormControl('')
  }),
  address: new FormGroup({
    street: new FormControl(''),
    city: new FormControl('')
  })
});

// In the template:

<form [formGroup]="userForm">
  <div formGroupName="personalInfo">
    <label>Name:</label>
    <input formControlName="name">

    <label>Age:</label>
    <input formControlName="age">
  </div>

  <div formGroupName="address">
    <label>Street:</label>
    <input formControlName="street">

    <label>City:</label>
    <input formControlName="city">
  </div>

  <button type="submit">Submit</button>
</form>

// Notice [formGroup]=... when a new group is CREATED and formGroupName=... when an existing group is MENTIONED
// (the nested groups were created when [formGroup] created their parent group).

// @@@ Validation in FormGroup

// You can apply validation to the entire group instead of individual controls.
// For example, suppose you want a custom validator to check that the age is always greater than 18:

import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

function ageValidator(control: AbstractControl): ValidationErrors | null {
  const age = control.get('age')?.value;
  return age > 18 ? null : { 'ageInvalid': true };
}

userForm = new FormGroup({
  name: new FormControl(''),
  age: new FormControl('')
}, { validators: ageValidator });

// ######################################################################################################
// FormArray
// ######################################################################################################

// FormArray is a class in Angular’s Reactive Forms module that allows you to manage an array of form controls.

// Unlike FormGroup, which organizes form controls by key-value pairs, FormArray organizes form controls as an array.
// This means each control in the FormArray has an index and can be accessed via its position in the array.
// It's used when you need to handle dynamic forms, where the number of form controls is not fixed and can change based on user interaction
//         (like adding or removing items in a list).

// Key features of FormArray:
// * Dynamic Form Control Management: It allows adding, removing, or updating form controls dynamically,
//   For example: if user unselects "Billing address same as shipping address", we generate the Billing address form on the fly by adding it to the FormArray.
// * Manages Form Controls: A FormArray can hold instances of FormControl, FormGroup, or even another FormArray -
//   its constructor accepts an array of FormControl, FormGroup, or FormArray instances.
// * Tracks Form State: Similar to FormGroup, it tracks the state of all the controls it contains (such as valid, invalid, touched, dirty, etc.).

// FormArray elements are manipulated using the next methods:
push() // adds a control to FormArray
get('<element name>') // reads a control from FormArray
removeAt(index) // deleted a control from FormArray

// Let’s say you want a form where a user can add a list of email addresses.
// Define a FormArray in the Component:
import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';

@Component({
  selector: 'app-email-form',
  templateUrl: './email-form.component.html'
})
export class EmailFormComponent {
  private readonly _emailValidators: ValidatorFn[] = [Validators.required, Validators.email];

  emailForm = new FormGroup({
    emails: new FormArray([
      new FormControl('', this._emailValidators)
    ])
  });

  get emails(): FormArray {
    return this.emailForm.get('emails') as FormArray;
  }

  addEmail() {
    this.emails.push(new FormControl('', this._emailValidators));
  }

  removeEmail(index: number) {
    this.emails.removeAt(index);
  }

  onSubmit() {
    if (this.emailForm.valid) {
      console.log(this.emailForm.value);
    }
  }
}

// Template for the Form:

<form [formGroup]="emailForm" (ngSubmit)="onSubmit()">
  <div formArrayName="emails">
    <div *ngFor="let email of emails.controls; let i = index">
      <label for="email-{{ i }}">Email {{ i + 1 }}</label>
      <input id="email-{{ i }}" type="email" [formControlName]="i">
      <button type="button" (click)="removeEmail(i)">Remove</button>
      <div *ngIf="emails.controls[i].invalid && emails.controls[i].touched">
        Please enter a valid email.
      </div>
    </div>
  </div>
  <button type="button" (click)="addEmail()">Add Email</button>
  <button type="submit" [disabled]="emailForm.invalid">Submit</button>
</form>

// You can access individual controls within the FormArray using their index:
const emailControl = this.emails.at(0); // access the first email control

// Example Use Case: Nested FormGroup within a FormArray

// In many cases, you might want to nest a FormGroup within a FormArray to manage a list of more complex data structures
//      (e.g., multiple phone numbers with type and number).

// Define a FormArray of FormGroup in the Component:

@Component({
  selector: 'app-phone-form',
  templateUrl: './phone-form.component.html'
})
export class PhoneFormComponent {
  private readonly _phoneValidators: ValidatorFn[] = [Validators.required, Validators.minLength(10)];

  phoneForm = new FormGroup({
    phones: new FormArray([
      new FormGroup({
        type: new FormControl('Home'),
        number: new FormControl('', this._phoneValidators)
      })
    ])
  });

  get phones(): FormArray {
    return this.phoneForm.get('phones') as FormArray;
  }

  addPhone() {
    this.phones.push(
      new FormGroup({
        type: new FormControl('Work'),
        number: new FormControl('', this._phoneValidators)
      })
    );
  }

  removePhone(index: number) {
    this.phones.removeAt(index);
  }

  onSubmit() {
    if (this.phoneForm.valid) {
      console.log(this.phoneForm.value);
    }
  }
}

// Template for the Phone Form:

<form [formGroup]="phoneForm" (ngSubmit)="onSubmit()">
  <div formArrayName="phones">
    <div *ngFor="let phone of phones.controls; let i = index" [formGroupName]="i">
      <label for="type-{{ i }}">Phone Type</label>
      <select id="type-{{ i }}" formControlName="type">
        <option>Home</option>
        <option>Work</option>
        <option>Mobile</option>
      </select>

      <label for="number-{{ i }}">Phone Number</label>
      <input id="number-{{ i }}" type="text" formControlName="number">
      <button type="button" (click)="removePhone(i)">Remove</button>

      <div *ngIf="phones.controls[i].get('number').invalid && phones.controls[i].get('number').touched">
        Phone number is required and must be at least 10 characters.
      </div>
    </div>
  </div>

  <button type="button" (click)="addPhone()">Add Phone</button>
  <button type="submit" [disabled]="phoneForm.invalid">Submit</button>
</form>

// @@@ Managing Values in FormArray:

// Retrieve Values: The value of the FormArray can be retrieved as an array of values:
const phoneNumbers = this.phoneForm.value.phones; // Output: [{ type: 'Home', number: '1234567890' }]

// @@@ Validators in FormArray:
// You can apply validators to the entire FormArray (e.g., requiring that at least one item exists) or to individual controls within it.

// Example: Requiring at least one phone number:
const phoneForm = new FormGroup({
  phones: new FormArray([], Validators.required)
});

// Summary of FormArray:
// Dynamic Form Controls: FormArray is ideal for handling dynamic or variable-length lists of controls,
//      such as multiple phone numbers, email addresses, or items.
// Tracks Form State: It tracks the validity, value, and interaction state of its child controls.
// Flexible: Can contain FormControl, FormGroup, or even nested FormArray elements.
// Validators: Validators can be applied to both individual controls inside the array and the array itself.

// ######################################################################################################
// FormBuilder
// ######################################################################################################

// FormBuilder is a service in Angular's Reactive Forms module that provides a more convenient and concise way to create form controls,
//       form groups, and form arrays compared to manually instantiating them using new FormControl(), new FormGroup(), or new FormArray().
// It provides helper methods like group(), control(), and array() that make it easier to define forms in a declarative way and reduced boilerplate code.

// Main methods:

control()
// Creates a new FormControl instance.
// It takes an initial value and an optional array of validators

group()
// Creates a new FormGroup instance.
// It takes an object of key-value pairs, where the keys are control names, and the values are either FormControl instances,
//         initial values, or arrays containing initial values and validators.

array()
// Creates a new FormArray instance.
// It takes an array of controls and optionally, validators.

// Example usage:

import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-form',
  template: '...'
})
export class UserFormComponent {
  constructor(private _fb: FormBuilder) { } // <<<<<<<<<<<<<< FormBuilder is typically injected into a component's constructor

  userForm = this._fb.group({ // <<<<<<< creating FormGroup
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    address: this._fb.group({
      street: ['', Validators.required],
      city: ['', Validators.required],
      zipCode: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]]
    }),
    phones: this._fb.array([ // <<<<<<<<<<<<<< creating FormArray
      this._fb.control('', Validators.required)
    ])
  });

  addPhone() {
    const phones = this.userForm.get('phones') as FormArray;
    phones.push(this._fb.control('', Validators.required)); // <<<<<<<<<<<<<< creating FormControl
  }
}

// ######################################################################################################
// An example demonstrating FormControl, FormGroup, FormArray & FormBuilder in one component
// ######################################################################################################

// form-sample.component.ts

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormArray, Validators } from '@angular/forms';

@Component({
  selector: 'app-form-sample',
  templateUrl: './form-sample.component.html'
})
export class FormSampleComponent implements OnInit {
  myForm: FormGroup;
  
  constructor(private _fb: FormBuilder) {}

  ngOnInit(): void {
    this.myForm = this._fb.group({
      // FormControl with Validators
      username: new FormControl('', [Validators.required, Validators.minLength(3)]),

      // FormArray with dynamic controls
      hobbies: new FormArray([
        new FormControl('Reading'),
        new FormControl('Sports')
      ]),

      // Nested FormGroup
      address: new FormGroup({
        street: new FormControl(''),
        city: new FormControl(''),
        postalCode: new FormControl('')
      })
    });
  }

  get hobbies(): FormArray {
    return this.myForm.get('hobbies') as FormArray;
  }

  addHobby(): void {
    this.hobbies.push(new FormControl(''));
  }

  onSubmit(): void {
    console.log(this.myForm.value);
  }
}

// form-sample.component.html

<form [formGroup]="myForm" (ngSubmit)="onSubmit()">
  <!-- FormControl Example -->
  <div>
    <label>Username</label>
    <input formControlName="username">
    <div *ngIf="myForm.get('username').invalid && myForm.get('username').touched">
      Username is required and must be at least 3 characters.
    </div>
  </div>

  <!-- FormArray Example -->
  <div>
    <label>Hobbies</label>
    <div formArrayName="hobbies">
      <div *ngFor="let hobby of hobbies.controls; let i=index">
        <input [formControlName]="i">
      </div>
    </div>
    <button type="button" (click)="addHobby()">Add Hobby</button>
  </div>

  <!-- Nested FormGroup Example -->
  <div formGroupName="address">
    <label>Address</label>
    <input formControlName="street" placeholder="Street">
    <input formControlName="city" placeholder="City">
    <input formControlName="postalCode" placeholder="Postal Code">
  </div>

  <button type="submit" [disabled]="myForm.invalid">Submit</button>
</form>

// ######################################################################################################
// UntypedFormControl, UntypedFormGroup, UntypedFormArray, UntypedFormBuilder
// ######################################################################################################

// The Untyped versions of Angular's form classes were introduced in Angular v14.
// These versions provide no type checking for form controls, which means that they do not enforce or infer types for form control values and states.

// The typed versions allow you to specify and enforce the types of values in your forms:
const typedControl = new FormControl<string>('');
typedControl.setValue(123); // error: Type 'number' is not assignable to type 'string'

// The untyped versions do not enforce any types, and values are treated as any:
const untypedControl = new UntypedFormControl('');
untypedControl.setValue(123); // no error

// The functionality of the Untyped versions is identical to their typed counterparts.
// They have the same API and behavior, except for the fact that type checking is disabled.

// Why Use Untyped Versions?
// The untyped versions are designed to maintain backward compatibility with older codebases where types were not explicitly enforced.
// They can be useful when migrating legacy code that did not previously use types.

// ######################################################################################################
// FormsModule & ReactiveFormsModule
// ######################################################################################################

// FormsModule and ReactiveFormsModule are two modules that provide different approaches to handling and building forms.
// Both are part of Angular’s Forms API, and each offers a distinct strategy for building forms.

// ------------------------------------------------------------------------------------------------------
// FormsModule (Template-Driven Forms):
// ------------------------------------------------------------------------------------------------------

// Approach: Template-driven forms rely heavily on directives (ngModel) defined within the template (HTML).
// They are suitable for simpler forms where most of the form logic and validation is embedded (managed declaratively) in the template itself.

// Key Characteristics of FormsModule:
// * Two-Way Data Binding: Uses Angular’s two-way binding - [(ngModel)] - to synchronize the form inputs with the component properties.
// * Minimal Component Logic: Most of the form handling happens in the template.
// * Built-In Validation: Uses template-driven directives like required, minlength, maxlength, etc., for validation.
// * Simplicity: It's easy to set up, making it a good choice for basic forms without complex validation logic.
// * Automatically tracks form state: Tracks the form control’s state (valid, touched, dirty, etc.) without requiring manual form control management.

// Example Usage:

// Import FormsModule in AppModule:

import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [FormsModule],
  declarations: [AppComponent],
})
export class AppModule {}

// Template-Driven Form:

<form #form="ngForm">
  <label>Username</label>
  <input type="text" name="username" [(ngModel)]="username" required minlength="3">
  <div *ngIf="form.controls['username'].invalid && form.controls['username'].touched">
    Username is required and must be at least 3 characters.
  </div>
  <button [disabled]="form.invalid">Submit</button>
</form>

// * The ngForm directive binds the form to Angular’s form management.
// * The [(ngModel)] directive provides two-way binding between the input and the component property.
// * Validators like required and minlength are applied directly in the template.

// ------------------------------------------------------------------------------------------------------
// ReactiveFormsModule (Reactive Forms):
// ------------------------------------------------------------------------------------------------------

// Reactive forms (also called model-driven forms) are defined in the component class and are more suitable for complex forms
//      with advanced validation and dynamic control creation. This approach gives developers full programmatic control over form handling.

// Key Characteristics of ReactiveFormsModule:
// * Form Control in Component:
//      Form-related objects (e.g., FormControl, FormGroup, FormArray) are defined and managed in the component class rather than the template.
// * Reactive and Explicit:
//      Form handling is reactive, meaning changes to form values or state can trigger logic in the component using observables and subscriptions.
// * Complex Validation:
//      Supports synchronous and asynchronous custom validators, enabling more advanced validation logic.
// * Better Structure:
//      Encourages a more structured and testable approach, especially useful for forms with complex logic or dynamic form controls.

// Example Usage:

import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [ReactiveFormsModule],
  declarations: [AppComponent],
})
export class AppModule {}

// Reactive Form Example in Component:

import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  ngOnInit() {
    this.loginForm = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.minLength(3)]),
      password: new FormControl('', [Validators.required])
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      console.log(this.loginForm.value);
    }
  }
}

// Reactive Form Template:

<form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
  <label>Username</label>
  <input formControlName="username">
  <div *ngIf="loginForm.get('username').invalid && loginForm.get('username').touched">
    Username is required and must be at least 3 characters.
  </div>

  <label>Password</label>
  <input formControlName="password" type="password">
  <div *ngIf="loginForm.get('password').invalid && loginForm.get('password').touched">
    Password is required.
  </div>

  <button type="submit" [disabled]="loginForm.invalid">Login</button>
</form>

// * The formGroup directive binds the form in the template to the FormGroup defined in the component.
// * The formControlName directive is used to link form controls (like username and password) to the FormControl instances defined in the component.
// * Validation is handled programmatically in the component class, and error messages are displayed conditionally based on the control's state.

// Summary of Differences:

// |--------------------|---------------------------------------|----------------------------------------|
// | Feature            | FormsModule (Template-Driven)         | ReactiveFormsModule (Reactive Forms)   |
// |--------------------|---------------------------------------|----------------------------------------|
// | Form Definition    | Mostly in the template                | Mostly in the component class          |
// | Form Control       | Uses ngModel for two-way binding      | Uses FormControl, FormGroup, etc.      |
// | Best For           | Simpler forms, declarative logic      | Complex forms, dynamic controls        |
// | Validation         | Template-driven (required, minlength) | Programmatic, with custom validators   |
// | Dynamic Forms      | Limited dynamic control handling      | Full support for dynamic form controls |
// | Data Binding       | Two-way data binding ([(ngModel)])    | Explicit, reactive data flow           |
// | Form Control State | Tracked by Angular automatically      | Managed programmatically               |
// |--------------------|---------------------------------------|----------------------------------------|

// Both modules can be used in the same application, depending on the complexity and requirements of the forms being handled.
// However, you would typically use one approach per form (either template-driven or reactive) to maintain consistency and clarity.

// ######################################################################################################
// NG_VALUE_ACCESSOR & ControlValueAccessor
// ######################################################################################################

// NG_VALUE_ACCESSOR and ControlValueAccessor are used to create custom form controls that integrate seamlessly with Angular’s forms API
//         (both template-driven and reactive forms).
// They allow custom components to participate in Angular’s form control lifecycle, such as handling value changes, setting control values,
//         and tracking form status (like touched, dirty, valid).

// ------------------------------------------------------------------------------------------------------
// NG_VALUE_ACCESSOR
// ------------------------------------------------------------------------------------------------------

// NG_VALUE_ACCESSOR is a provider token that Angular uses to locate and inject a ControlValueAccessor for a custom form control.
// Allows Angular to recognize a custom component as a form control and enables it to work with Angular forms (FormControl, ngModel, etc.).

// It connects the custom form control to the Angular forms system by providing an instance of ControlValueAccessor for the control.
// This ensures that the custom control can participate in the form’s lifecycle (value changes, validation, etc.).

// NG_VALUE_ACCESSOR is provided at the component level in the providers array to associate the custom form control with the ControlValueAccessor.

// ------------------------------------------------------------------------------------------------------
// ControlValueAccessor
// ------------------------------------------------------------------------------------------------------

// ControlValueAccessor is an interface that defines the methods required for Angular to interact with a form control
//         (get/set value, mark as touched, etc.).
// By implementing this interface, custom components can work like standard form controls (e.g., <input>, <select>, etc.).

// It bridges the communication between a form control and the Angular forms API.
// When you implement ControlValueAccessor, your custom component can manage how it reads, writes, and updates form values,
//         just like native HTML form elements.

// Methods:

writeValue(obj: any): void
// This method is called when the form control's value is set by Angular (e.g., when initializing the form).
// The custom component must update its internal value based on the incoming value.

registerOnChange(fn: any): void
// Angular calls this method to register a handler function (fn) that will be called when the control's value changes in the view.
// The custom control must call this function whenever its value changes, so Angular knows about the change.

registerOnTouched(fn: any): void
// This method is called by Angular to register a handler function (fn) that should be called when the control is touched
//         (i.e., interacted with but not necessarily changed).
// The custom component should call this function to inform Angular that the control has been "touched."

setDisabledState?(isDisabled: boolean): void
// This optional method is called by Angular when the control should be disabled or enabled.

// Example of a Custom Form Control Using ControlValueAccessor and NG_VALUE_ACCESSOR:

// Here’s how you can create a custom form control component (a simple toggle button) that works with Angular forms
//      using ControlValueAccessor and NG_VALUE_ACCESSOR.

// Custom Toggle Button Example

// Custom Toggle Button Component:

import { Component, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Component({
  selector: 'app-toggle-button',
  template: `
    <button (click)="toggle()" [class.active]="value">
      {{ value ? 'ON' : 'OFF' }}
    </button>
  `,
  styles: [
    `
    button.active {
      background-color: green;
      color: white;
    }
    button {
      background-color: red;
      color: white;
    }
    `
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ToggleButtonComponent),
      multi: true
    }
  ]
})
export class ToggleButtonComponent implements ControlValueAccessor {
  value: boolean = false;

  // Function to call when the value changes
  private onChange: (value: boolean) => void = () => {};

  // Function to call when the control is touched
  private onTouched: () => void = () => {};

  // Called when the value needs to be updated from the parent
  writeValue(value: boolean): void {
    this.value = value;
  }

  // Registers a function to call when the value changes
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  // Registers a function to call when the control is touched
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  // Sets the control to disabled state
  setDisabledState(isDisabled: boolean): void {
    // Here you can handle the disabled state if needed
  }

  // Toggles the button value and notifies Angular of the change
  toggle(): void {
    this.value = !this.value;
    this.onChange(this.value); // Notify Angular of value change
    this.onTouched(); // Mark the control as touched
  }
}

// Using the Custom Toggle Button in a Form:

import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-toggle-form',
  template: `
    <form [formGroup]="form">
      <label>Toggle:</label>
      <app-toggle-button formControlName="toggle"></app-toggle-button>
      <button type="submit" [disabled]="form.invalid">Submit</button>
    </form>
  `
})
export class ToggleFormComponent {
  form = new FormGroup({
    toggle: new FormControl(false)
  });

  onSubmit() {
    console.log(this.form.value);
  }
}

// Explanation:

// NG_VALUE_ACCESSOR:
// - In the ToggleButtonComponent, we declare NG_VALUE_ACCESSOR in the providers array. This tells Angular to treat this component as a form control.
// - The useExisting with forwardRef() ensures that the ToggleButtonComponent itself is used for the NG_VALUE_ACCESSOR token.

// ControlValueAccessor:
// - The custom component implements ControlValueAccessor to integrate with Angular’s forms API.
// - writeValue: This method updates the component’s internal state (value) when the form model changes
//         (e.g., when initializing the form or resetting it).
// - registerOnChange: This method registers a function that is called whenever the component’s value changes\
//         (in this case, when the user clicks the toggle button). This allows Angular to keep track of form changes.
// - registerOnTouched: Registers a function to call when the component is "touched" (e.g., when the user interacts with it).
// - setDisabledState: Optionally manages the disabled state of the control (not used in this example).

// Summary:
// * NG_VALUE_ACCESSOR is a provider token used to link Angular forms with custom form controls by injecting a ControlValueAccessor.
// * ControlValueAccessor is an interface that custom form controls implement to communicate with Angular’s form system.
//         It provides methods for reading and writing values, tracking control states, and handling disabled states.
// * By implementing ControlValueAccessor and using NG_VALUE_ACCESSOR, custom components can be integrated with Angular forms
//         (both template-driven and reactive) just like native HTML form elements.