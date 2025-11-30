// ######################################################################################################
// Content projection using <ng-content>
// ######################################################################################################

// Content projection is a powerful feature that allows you to insert dynamic content into a component.
// Allows a child component to receive and display content from its parent component.
// This is achieved using the `<ng-content>` directive, which acts as a placeholder for content that is passed from a parent.

// Step-by-Step Example:

// 1. Create the Parent Component

// Uses the Child component and provides it with the content to be projected.
// The content inside <app-child> tags (the selector of the Child component) is inserted into the Child component at the <ng-content> location.

@Component({
  selector: 'app-parent',
  template: `
    <div>
      <h1>Parent Component</h1>
      <app-child>
        <p>This content is projected from the Parent to the Child component.</p>
      </app-child>
    </div>
  `
})
export class ParentComponent {}

// 2. Create the Child Component
// It will use the <ng-content> tag to specify where the projected content should be inserted.
// <ng-content> acts as a placeholder and, on rendering, will be replaced with the content passed from the Parent component.

@Component({
  selector: 'app-child',
  template: `
    <div>
      <h2>Child Component</h2>
      <ng-content></ng-content>
    </div>
  `
})
export class ChildComponent {}

// 3. Rendered HTML by the Child Component

// When the Parent component is rendered, the content inside the <app-child> tags is projected into the Child component
//    where the <ng-content> tag is placed. The rendered HTML will look like this:

<div>
  <h1>Parent Component</h1>
  <div>
    <h2>Child Component</h2>
    <p>This content is projected from the Parent to the Child component.</p>
  </div>
</div>

// @@@ The "select" attribute of the <ng-content> tag

// Allows you to specify which content from the parent component should be projected into particular placeholders within the child component.
// This is useful when you want to project different parts of the parent content into different locations in the child component's template.

// Let's create an example with a Child component that has multiple `<ng-content>` tags, each with a `select` attribute,
//    and a Parent component that provides content to be projected.

// 1. Create the Parent Component

// The Parent component provides content with specific attributes that match those specified in the `select` attributes of the `<ng-content>` tags.

@Component({
  selector: 'app-parent',
  template: `
    <div>
      <h1>Parent Component</h1>
      <app-child>
        <div header>
          <p>This is the header content projected from the Parent.</p>
        </div>
        <div body>
          <p>This is the body content projected from the Parent.</p>
        </div>
        <div footer>
          <p>This is the footer content projected from the Parent.</p>
        </div>
      </app-child>
    </div>
  `
})
export class ParentComponent {}

// 2. Create the Child Component

// The Child component has multiple `<ng-content>` tags, each with a `select` attribute to specify which content to project.
// Notice that the selector of the parent element is passed to 'select' in square brackets ("[header]"):

@Component({
  selector: 'app-child',
  template: `
    <div>
      <h2>Child Component</h2>
      <div>
        <ng-content select="[header]"></ng-content>
      </div>
      <div>
        <ng-content select="[body]"></ng-content>
      </div>
      <div>
        <ng-content select="[footer]"></ng-content>
      </div>
    </div>
  `
})
export class ChildComponent {}

// 3. Rendered HTML by the Child Component

// When the Parent component is rendered, the content with the specified attributes is projected
// into the corresponding `<ng-content>` tags in the Child component.:

<div>
  <h1>Parent Component</h1>
  <div>
    <h2>Child Component</h2>
    <div>
      <p>This is the header content projected from the Parent.</p>
    </div>
    <div>
      <p>This is the body content projected from the Parent.</p>
    </div>
    <div>
      <p>This is the footer content projected from the Parent.</p>
    </div>
  </div>
</div>

// Identifiers like header, body, and footer used in <div header>, <div body>, and <div footer> are attribute selectors.
// They are used to match elements for projection into specific <ng-content> slots within a child component.

// The select attribute of an <ng-content> tag can use any valid CSS selector to identify which elements should be projected into that slot.
// When you use attributes like header, body, and footer, you are essentially marking these elements with custom attributes
// 		that can be matched by the select attribute in the <ng-content> tag.
// In the child component, you can define <ng-content> tags with select attributes that correspond to these custom attributes.
// For example, <ng-content select="[header]"> will project any element from the parent that has the header attribute.

// The identifiers like header, body, and footer are not HTML reserved words or template variables.
// You can invent any attribute names you want to match elements for content projection.

// The select attribute in <ng-content> can accept any valid CSS selector, including tag names, class names, IDs, and attribute selectors.
// This means you can use whatever naming convention you prefer for these attributes, as long as they are valid CSS selectors.

// Here is an example of using the <ng-content> tag with the select attribute to project content based on a CSS class:
// The Parent component's template fragment (supposing the 'header' class is definded in the CSS file):
<div class="header">
  <p>This is the header content projected from the Parent.</p>
</div>
// The Child component's template fragment:
// Notice that the class of the parent element is passed to 'select' with a dot (".header"):
<ng-content select=".header"></ng-content>
// The same HTML is rendered.
// When using a CSS class, all elements in the parent component's template that match the specified class will be projected into the child component.
// This means that if the parent component has multiple elements with the class header,
//		all of them will be projected into the <ng-content select=".header"> slot in the child component.

// Also, the tag's ID can be used as a CSS selector:
// The Parent component's template fragment:
<div id="header">
  <p>This is the header content projected from the Parent.</p>
</div>
// The Child component's template fragment:
// Notice that the ID of the parent element is passed to 'select' with a pound sign ("#header"):
<ng-content select="#header"></ng-content>
// The same HTML is rendered.

// Difference Between `<ng-content>` tags with and without `select` attribute
// * Without `select` attribute:
// 		Projects all the content from the parent component into the child component at the location of the `<ng-content>` tag.
// 		It acts as a single placeholder for all content.
// * With `select` attribute:
// 		Allows selective content projection based on attributes or element types.
// 		This enables you to project different parts of the parent content into specific locations within the child component's template.

// Notice that the projected content becomes available firstly in the ngAfterContentInit lifecycle hook.

// ######################################################################################################
// @ContentChild & @ContentChildren decorators
// ######################################################################################################

// The @ViewChild & @ViewChildren decorators can access only elements & components that are part of the component's own template.

// @ContentChild and @ContentChildren are used to access elements or components that are projected into the component using content projection
//		(i.e., elements passed from the parent component into the <ng-content> slot of the child component).

// Let's create an example with a Parent component that projects content into a Child component using <ng-content>,
//		and the Child component uses @ContentChild and @ContentChildren to access the projected content.

// Parent Component (provides content to be projected into the Child component):

@Component({
  selector: 'app-parent',
  template: `
    <div>
      <h1>Parent Component</h1>
      <app-child>
        <div #headerContent>
          <p>This is the header content projected from the Parent.</p>
        </div>
        <div #paragraphContent>
          <p>This is the first paragraph content projected from the Parent.</p>
        </div>
        <div #paragraphContent>
          <p>This is the second paragraph content projected from the Parent.</p>
        </div>
      </app-child>
    </div>
  `
})
export class ParentComponent {}

// Child Component (uses <ng-content> to allow content projection, and uses @ContentChild and @ContentChildren to access the projected content):

import { Component, ContentChild, ContentChildren, AfterContentInit, QueryList } from '@angular/core';

@Component({
  selector: 'app-child',
  template: `
    <div>
      <h2>Child Component</h2>
      <ng-content></ng-content>
    </div>
  `
})
export class ChildComponent implements AfterContentInit {
  @ContentChild('headerContent') header!: any;
  @ContentChildren('paragraphContent') paragraphs!: QueryList<any>;

  ngAfterContentInit() {
    console.log('Header Content:', this.header);
    console.log('Paragraph Contents:', this.paragraphs.toArray());
  }
}

// Rendered HTML:

<div>
  <h1>Parent Component</h1>
  <div>
    <h2>Child Component</h2>
    <div>
      <p>This is the header content projected from the Parent.</p>
    </div>
    <div>
      <p>This is the first paragraph content projected from the Parent.</p>
    </div>
    <div>
      <p>This is the second paragraph content projected from the Parent.</p>
    </div>
  </div>
</div>

// All elements inside <app-child> in the Parent component are projected into the location of the <ng-content> tag within the Child's template.
// The elements with #headerContent and #paragraphContent are directly inserted into the Child component's <div> that contains the <ng-content> tag.
// The template reference variables (#headerContent, #paragraphContent) do not appear in the rendered HTML; they are used internally for querying.