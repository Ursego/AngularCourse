// Attribute Directives (also known as Core Directives):
// * Don't change the DOM structure, only modify the behavior or appearance of existing elements
// * In contrast to Structural Directives (which change the DOM layout), Core Directives are not prefixed with an asterisk (*) or pound (@).
// 		Instead, they are typically used with square brackets [], for examples: [ngModel], [ngClass], [ngStyle]
// * Can have multiple core directives on a single element

// ######################################################################################################
// ### [ngClass]
// ######################################################################################################

// The standard 'class' property of an HTML element (like <div class="...">) contains hardcoded CSS class(es) to be applied.
// If the classes are known in compile time, you would simply assign them to "class":
<div class="class1 class2">

// [ngClass] allows to build the value of the 'class' property dynamically - it can add or remove CSS classes based on component logic:
<img [ngClass]="<the logic for adding and removing classes>" />

// In the rendered HTML:
//		"[ngClass]" is replaced with "class".
//		Each class name passed to [ngClass]) appears (or doesn't appear) depending on its boolean expression.

// In fact, [ngClass] is a special case of the Property binding.
// Property binding will be described soon, but I'll tell you in advance that the Property binding syntax is
[html_property]="component_variable_or_method"
// like
<div [class]="getButtonClasses()"></div>
// For the last example, getButtonClasses() could return something like: "btn btn-lg btn-primary" or "btn btn-sm btn-secondary disabled"

// So, if we already have [class] which accepts a dinamically built CSS classes list, why do we need [ngClass]?
// There are some differences between them:

// [class]
// 		You must provide a complete string that will be assigned to the "class" property as is. This follows the standard behavior of Property binding.
//		The string must be a space-separated list of CSS classes, and nothing else.
// 		It completely replaces the previous value of the HTML "class" property, removing any static classes that existed on the element but aren't included in the new string.

// [ngClass]
// 		Much more flexible.
// 		Adds/removes classes dynamically depending on logical conditions, merging them with existing static classes (rather than deleting them).
// 		Can accept a string which contains several types of values: a plain string with a space-separated list of CSS classes, an array, or an object.
// 		It can contain logic (like the ternary operator), and access fields and methods of the component (usually boolean).
// 		That is explained in details next.

// @@@ The string passed to [ngClass] can be:

// #1. List of classes separated by space (in fact, a string which contains a string which will be the value of the static 'class' property as is):
<div [ngClass]="'class1 class2'">
// That is similar to [class] but the whole list is ornamented by addidional quotes - the outer string contains an inner string be rendered as is
//    (you want to render [class]='class1 class2', not [class]=class1 class2).
// In contrast to [class], the classes are added to the already existing classes rather than replace them.

// #2. Array of classes:
<div [ngClass]="['class1', 'class2']">
// This is convenient because it simplifies the function returning such a string — the function just dynamically builds and returns an array of classes
//    without worrying about concatenating them into a single string (Angular will handle that).
// Notice that the array can have a mix of static (hardcoded) classes with objects and dynamic expressions, for example:
<div [ngClass]="['class1', { 'class2': isClass2, 'class3': isClass3 }, 'class4', isClass5() ? 'class5' : '']">
// This div will always have class1 and class4, and it will conditionally have class2, class3 and class5 based on the respective boolean values.

// #3. Object with key-value pairs:
<div [ngClass]="{'active': isActive, 'disabled': !isEnabled, 'highlight': isImportant()}">
// In each pair:
// 		* the key is the CSS class name;
// 		* the value is a boolean expression (normally, the component's property or method) which governs wether or not the CSS class must be applied.

// REMARK REGARDING #1, #2 AND #3:
// In fact, you will never assign a hardcoded string to [ngClass] as shown in #1 and #2.
// These examples only demonstrate strings which are normally built dynamically and returned by a method of the component class. That is the subject of #4.
// The pattern of #3 can be used with the string hardcoded - the actual classes are still added dynamically by the boolean expressions.
// But it's better to incapsulate the logic in a method which retrns the dictionary's values as true and false - try to minimize logic in HTML templates.

// #4. Component method returning a string like in #1, #2 or #3:
<div [ngClass]="getClasses()">

// This pattern
[ngClass]="<a method returning a string like in #1, #2 or #3>")
// is what you will use in real work.

// A sample getClasses() method which returns a string (#1) or an array (#2) would be simple - just add (or don't add) classes to the string or array depending on conditions.
// If no CSS classes shuld be applied due to all the conditions being false, make the method return an empty string (return '') or an empty array (return []).

// But a sample getClasses() method which returns an object (#3) is more interesting.
// Of course, the dictionary's values in that object will be "ready to cook" true and false, not Boolean expressions to produce them as was shown in #3:
@Component({
	selector: 'app-my-component',
	template: 'app-my-template'
  })
  export class MyComponent {
	isActive = true;
	isEnabled = false;
  
	isImportant(): boolean {
	  return false;  // in this example, we'll just return false for simplicity
	}
  
	getClasses(): { [key: string]: boolean } {
		return {
		  active: this.isActive,
		  disabled: !this.isEnabled,
		  highlight: this.isImportant()
		};
	  }
  }

// getClasses() will return the next object:
{"active": true, "disabled": true, "highlight": false}

// Then the actual rendered HTML would be:
<div class="active disabled">Content here</div>
// As you see, highlight is not there since it's false.

// Note the type getClasses() returns:
{ [key: string]: boolean }
// It's a TypeScript index signature which defines a key-value object with an arbitrary number of pairs, where the keys are strings and the values are booleans.
// "key" is not actually used in the code but serves as a placeholder name for the key in the index signature.
// You can use any name for the placeholder in the index signature, not just "key", for example:
{ [property: string]: any }
// or
{ [prop: string]: any }

// @@@ Combination of static and dynamic classes:

// An HTML element can have both a static 'class' attribute and [ngClass]:
<div class="bold" [ngClass]="getDiscountedClasses(product)">
// In this case, the classes from both sources are combined: the static 'class' attribute classes are applied first, and then the classes from [ngClass] are applied over them.

// A sample getDiscountedClasses() method:
getDiscountedClasses(product: IProduct): { [key: string]: boolean } {
    const discounted = (product.discount > 0);
    return { strikethrough: discounted, italic: discounted };
}

// Let's say, it returns
{ strikethrough: true, italic: true }

// Then the rendered HTML will be:
<div class="bold strikethrough italic">
// The point is that 'bold' is still there, [ngClass] didn't erase it - instead, it just added new classes after it.

// If the same class appears in both, it's not duplicated.
// For example, if the returned object would include 'bold':
{ bold: true, strikethrough: true, italic: true }
// then the rendered HTML would still be the same, with 'bold' appearing only once.

// However, what if 'bold' would be returned by getDiscountedClasses() as false?
{ bold: false, strikethrough: true, italic: true }
// In this case, the rendered <div> would not have 'bold' because [ngClass] explicitly removed it, even if 'bold' was statically defined in the class attribute before:
<div class="strikethrough italic">
// Angular is smart!

// This behavior allows for a flexible combination of static and dynamic class application.
// The hardcoded static classes provide a baseline, while [ngClass] adds or removes classes based on component logic.

// ######################################################################################################
// [ngStyle]
// ######################################################################################################

// Used to dynamically apply inline styles to HTML elements based on component logic.
// Renders to the standard HTML 'style' attribute.
// In contrast to [ngClass], it doesn't add or remove CSS properties, it only changes values of existing properties.
// Syntax:
[ngStyle]="expression"
// The expression can be an object, a method returning an object, or a property holding an object.

// 1. Using component's scalar Properties:
export class MyComponent {
	textColor = 'red';
	fontSize = 16;
}
// HTML template - [ngStyle] gets an object with key-value pairs build from the component's scalar Properties:
<div [ngStyle]="{'color': textColor, 'font-size': fontSize + 'px'}">
	Styled text
</div>

// 2. Using a component's Property holding an object with key-value pairs:
export class MyComponent {
	headerStyles = {
		'background-color': '#f0f0f0',
		'padding': '10px',
		'border-radius': '5px'
	};
}
// HTML template - [ngStyle] gets the name of the component's Property holding an object with key-value pairs:
<div [ngStyle]="headerStyles">
	Header content
</div>

// 3. Using a component's Method returning an object with key-value pairs:
export class MyComponent {
	getStyles() {
		return {
			'color': this.isImportant ? 'red' : 'black',
			'font-weight': this.isImportant ? 'bold' : 'normal',
			'font-size': this.textSize + 'px'
		};
	}
	isImportant = true;
	textSize = 18;
}
// HTML template - [ngStyle] gets the name of the component's Method returning an object with key-value pairs (notice the ()):
<div [ngStyle]="getStyles()">
	Dynamically styled content
</div>

// Style property names can be either camelCase or kebab-case:
<div [ngStyle]="{'fontSize': getFontSize()}">
<div [ngStyle]="{'font-size': getFontSize()}">
// The choice between these two formats is largely a matter of personal or team preference. However, there are some considerations:
// * Camel case is more consistent with TypeScript object notation.
// * Kebab case is more consistent with CSS property names.
// Many Angular developers prefer camelCase as it aligns with TypeScript/JavaScript conventions.
// For consistency within your codebase, it's best to choose one style and stick to it.

// Remember to add units for properties that require them:
{'width': width + 'px', 'height': height + '%'}

// [ngStyle] can be used combined with other directives like [ngClass]:
<div [ngClass]="{'active': isActive}" [ngStyle]="{'color': textColor}">
	Content
</div>
// The example will be rendered to the following HTML (supposing isActive = true and textColor = 'red'):
<div class="active" style="color: red;">
  Content
</div>

// Performance Considerations:
//		For static styles, it's more efficient to use regular CSS.
//		Use [ngStyle] only when styles need to be dynamically computed or changed.

// Typescript Type Safety:
//    You can use interfaces for better type checking:

interface Styles {
	'color': string;
	'font-size': string;
}

styleObject: Styles = {
	'color': 'blue',
	'font-size': '20px'
};

// @@@ Combination of static and dynamic styling

// When an HTML element has both [ngStyle] and a static 'style' attribute, the styles will be combined,
//		with [ngStyle] taking precedence for any overlapping properties. Here's how it works:
// 1. The static 'style' attribute is applied first.
// 2. The styles from [ngStyle] are then applied, overwriting any conflicting styles from the static attribute.
// 3. Non-conflicting styles from both sources are preserved.
<div style="color: blue; font-size: 16px;" 
     [ngStyle]="{'color': 'red', 'font-weight': 'bold'}">
  Content
</div>
// This will render as:
<div style="color: red; font-size: 16px; font-weight: bold;">
  Content
</div>
// In this result:
// - 'color: red' from [ngStyle] overwrites 'color: blue' from the static style.
// - 'font-size: 16px' from the static style is preserved.
// - 'font-weight: bold' from [ngStyle] is added.

// For more complex style manipulations, consider using `Renderer2` or direct DOM manipulation.