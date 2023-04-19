---
title: Form-associated custom elements FTW!
slug: form-associated-custom-elements-ftw
thumbnail: https://res.cloudinary.com/practicaldev/image/fetch/s--O9W6VojT--/c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000/https://dev-to-uploads.s3.amazonaws.com/uploads/articles/aozxeiegbjslp95kntsy.jpg
author: Myself
excerpt: Form-associated custom elements is a web specification that allows engineers to code custom form controls that report value and validity to `HTMLFormElement`...
---

Before Shadow DOM, you needed a framework to encapsulate component templates or styling. Shadow DOM was a game-changer because it allows you to code UI components without their logic clashing with other components using just the web platform. Shadow DOM poses challenges when HTML elements encapsulated by Shadow DOM need to participate in a form.

In this post, I'll provide an overview of form-associated custom elements. Form-associated custom elements is a web specification that allows engineers to code custom form controls that report value and validity to `HTMLFormElement`, while also promoting a fully accessible user experience.

## The Problem

With the encapsulation provided by Shadow DOM, engineers can code UI components where the CSS styling doesn't collide with other components. Shadow DOM provides a DOM tree for an element separated from the rest of the Document Object Model (DOM). The separation of concerns promoted by Shadow DOM is a boon for coding reusable UI components.

While Shadow DOM has several benefits, there are some complications when elements embedded in Shadow DOM have to interact with `HTMLFormElement`. Suppose you wanted to code a custom checkbox component using Shadow DOM. Checkboxes usually require a significant amount of CSS styling that overrides the browser defaults to match a given mockup. You code an autonomous custom element and style the `HTMLInputElement` with `type="checkbox"` in the context of Shadow DOM so the styling doesn't conflict with other elements. You give the component a tag name of `my-checkbox`. Just when you think you're following best practices, you place an instance of the custom element as a child of `HTMLFormElement`.

```html
<form>
  <my-checkbox></my-checkbox>
</form>
```

Upon inspection in Dev Tools, you may notice the `HTMLInputElement` cannot participate with the form. You can inspect this phenomenon in this [CodeSandbox](https://codesandbox.io/embed/custom-element-and-form-brpp29?fontsize=14&hidenavigation=1&theme=dark).

`HTMLInputElement` by design can report value and validity back to `HTMLFormElement`, but only when `HTMLInputElement` is a direct descendent of `HTMLFormElement`.

```html
<form>
  <input type="checkbox" />
</form>
```

When coding reusable components it's a good idea to provide an interface for web engineers that's familiar. It's typical for `HTMLInputElement` that are direct descendants of `HTMLFormElement` to have access to the parent form directly on the element. You can inspect this behavior in the following [CodeSandbox](https://codesandbox.io/embed/htmlformelement-hdied1?fontsize=14&hidenavigation=1&theme=dark).

Since the `HTMLInputElement` is found in an entirely different DOM tree (Shadow DOM), the `HTMLFormElement` doesn't recognize the `HTMLInputElement`.

![my-checkbox contains a HTMLInputElement embedded in Shadow DOM](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/7sygxv8opy3711m7oml5.png)

In short, `HTMLInputElement` embedded in Shadow DOM can't participate in the form.

## Enter Form-associated custom elements

In 2019, a new specification was proposed that solves this issue. Form-associated custom elements allow web engineers to use the benefits of Shadow DOM while providing an API that enables custom elements to participate in `HTMLFormElement`. Form-associated custom elements have all the benefits of autonomous custom elements. They can implement Shadow DOM and use the typical custom lifecycle hooks because they inherit from `HTMLElement`.

If you've coded autonomous custom elements, learning how to code form-associated custom elements is fairly similar. In the following examples, I'll demonstrate how a checkbox embedded in Shadow DOM can participate in an HTML form by implementing `formAssociated` and `ElementInternals`.

Before I mentioned that form controls that are native to the browser like `HTMLInputElement` automatically participate in `HTMLFormElement`. The form control is added to an Array-like interface on `HTMLFormElement`, allowing web engineers to loop through the form controls to handle common tasks like validation.

For the `Checkbox` component to participate in `HTMLFormElement` the same way, you simply need to set the value of a static property named `formAssociated` to `true`. the below example written with TypeScript does just that.

If you wish to follow along, fork this [CodeSandbox](https://codesandbox.io/embed/custom-element-and-form-brpp29?fontsize=14&hidenavigation=1&theme=dark) and start coding.

```typescript
export class Checkbox extends HTMLElement {
  static formAssociated = true;
  constructor() {
    ....
```

Inversely, if you wish to reference `HTMLFormElement` on instances of `Checkbox`, similar to how `HTMLInputElement` behaves when it's a direct descendant of `HTMLFormElement`, a method inherited from `HTMLElement` called `attachInternals` can be called with provides the same interface, along with the Accessibility Object Model (AOM). By setting a property on `Checkbox` named `_internals` to what's returned by `attachInternals`, you effectively add the `ElementInternals` interface to `Checkbox`.

```typescript
export class Checkbox extends HTMLElement {
  _internals: ElementInternals;
  static formAssociated = true;
  constructor() {
    super();
    this._internals = this.attachInternals();
```

### Parity

Later in this post, I'll provide an example of how you can reference a method on the `ElementInternals` interface that aids with validation. Before that, we should resolve some discrepancies between `Checkbox` and a typical `HTMLInputElement`. If we expect engineers to reuse this component, it should behave similarly to `HTMLInputElement`, which has a well-known interface. To provide parity between `HTMLInputElement` and `Checkbox`, let's define some getters and setters on `Checkbox`. First, make a getter that returns a reference of the `HTMLInputElement` so you can easily reference the element with `this.checkbox` throughout the logic of the component.

```typescript
  get checkbox(): HTMLInputElement {
    return this.shadowRoot?.querySelector("input") as HTMLInputElement;
  }
```

Next, define a getter and setter for the state of the checkbox. It's probably a good idea to make the `HTMLInputElement` the single source of truth here. Any getter and setter defined on `Checkbox` either returns the value or sets the value of `checked` on `this.checkbox`.

```typescript
  get checked(): boolean {
    return this.checkbox.checked;
  }
  set checked(state: boolean) {
    this.checkbox.checked = true;
  }
```

We could introduce several more properties on `Checkbox` to provide parity between it and a typical `HTMLInputElement`, but we'll stop there for now.

### Lessons Learned

While coding a UI library filled with form-associated custom elements, I found a couple of challenges in making the components reusable. Suppose you wanted to add validation logic to `Checkbox` and have the `class` another method called `onValidate`, including all the logic there. In the below example, I call `setValidity` on the `ElementInternals` interface, which reports the validity of the input to `HTMLFormElement`. This is convenient, however placing this logic here doesn't give a web engineer the ability to configure validations per business logic in different scenarios.

```typescript
  onValidate(state: boolean) {
    if (!state) {
      this._internals.setValidity({ customError: true }, "required");
    } else if (state === true) {
      this._internals.setValidity({});
    }
  }
```

A higher-level validation pattern is required that would allow engineers to loop through form controls and validate an entire form.

Another challenge had to do with making inline validation messages accessible. Getting screen readers to interpret validation messages as errors that should be read aloud at first seems tricky because of Shadow DOM, although is possible using WAI-ARIA attributes. Suppose this were the template instead of just the input. If the form control is invalid, custom logic could populate the `<div class="message">` with relevant content. WAI-ARIA attributes provide an immediate response for screen readers.

```html
<div class="control">
  <input type="checkbox" aria-describedby="message" />
</div>
<div class="message" aria-role="alert" aria-live="assertive" id="message"></div>
```

Autonomous custom elements that employ Shadow DOM provide encapsulation for component template and styling. Form-associated custom elements level up custom elements by allowing them to participate in a HTML form much like the "native" `HTMLInputElement`. Form-associated custom elements open the doors for custom user experiences like this joystick component, which reports it's value to `HTMLFormElement` like any other form control.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/lahkd3cl67al45ngpwct.png)

Form-associated custom elements are both practical and transformative, allowing engineers to code reusable form controls without the need for JavaScript frameworks and libraries. If you want to code a highly performant user interface that depends heavily on forms, form-associated custom elements are where it's at!

## Fullstack Web Components

Are you looking to code Web Components now, but don't know where to get started? I wrote [a book titled Fullstack Web Components](https://www.newline.co/courses/fullstack-web-components), a hands-on guide to coding UI libraries and web applications with custom elements. In Fullstack Web Components, you'll...

- Code several components using autonomous, customized built-in, and form-associated custom elements, Shadow DOM, HTML templates, CSS variables, and Declarative Shadow DOM
- Develop a micro-library with TypeScript decorators that streamlines UI component development
- Learn best practices for maintaining a UI library of Web Components with Storybook
- Code an application using Web Components and TypeScript
- Server-side render Web Components with Node.js and @lit-labs/ssr

![Fullstack Web Components](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/cka75oj2i0jusdw2atmt.png)

Fullstack Web Components [is available now on newline.co](https://www.newline.co/courses/fullstack-web-components).
