---
title: Accessibility with Customized built-ins
slug: make-the-web-more-accessible-with-customized-built-ins
thumbnail: https://res.cloudinary.com/practicaldev/image/fetch/s--40KqrO7f--/c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000/https://thepracticaldev.s3.amazonaws.com/i/3omvbiordowrgf87xnlx.jpg
author: Myself
excerpt: By making our web applications more accessible we open up the internet to people who can't navigate with a mouse or touch device...
---

To make our web applications accessible we have WAI-ARIA at our disposal. The [WAI-ARIA spec](https://www.w3.org/WAI/standards-guidelines/aria/) includes a bunch of attributes that can be added to DOM elements that provide additional context to tools like screen readers which help blind people read the content of a web site.

```html
<div role="button"></div>
```

By adding the role attribute to this div, we are letting screen readers interpret this div as another button. This is a step in the right direction, however we don't pick up all the traits of the button element that make it more accessible than a div.

## button

`HTMLButtonElement` allows the user to navigate via keyboard by default. When the user presses the tab key on the keyboard, the button will get focus.

If you listen for a click event on the button, this event will also fire when the user presses the `Enter` key. This functionality is baked into the button to make it more accessible for users who cannot navigate a site with a mouse, but instead rely on a keyboard.

```javascript
button.addEventListener("click", onButtonClick);
```

The only downside to using a button over a div is that it takes some additional styling to override the default look and feel of the button element. This is a small impediment to development compared to the blocker we are presenting for the end user who can't use a div with the keyboard.

## Customized built-in elements

What if we want to add even more functionality to the button but retain all the accessibility of HTMLButtonElement?

Customized built-in elements to the rescue!

In this example, we use the fetch API to make a request and style the button based on if that request is successful or has an error. This demonstrates how to use the `connectedCallback` lifecycle hook with custom elements v1 API to add an event listener for click, then make the request and based on the result of the request call either one of the custom methods (`onSuccess` and `onError`) defined on the class.

```javascript
class MyButton extends HTMLButtonElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.addEventListener("click", this.onClick);
  }
  onClick() {
    fetch("http://example.com/some.json")
      .then((response) => this.onSuccess)
      .catch((error) => this.onError);
  }
  onSuccess() {
    this.classList.add("is--success");
  }
  onError() {
    this.classList.add("is--error");
  }
}
customElements.define("my-button", MyButton, { extends: "button" });
```

The last line of this example allows the browser to interpret elements as an extension of the HTMLButtonElement. The main difference here from an autonomous custom element is the third argument, where we pass in an object with an `extends` property.

To use the new customized built-in element in a template, we use it like any other button but with a new `is` attribute. This attribute tells the browser to create an instance of the `MyButton` class after the document has been parsed.

```html
<button is="my-button"></button>
```

Voilà! Now we have a custom button element that is accessible via the keyboard. Essentially what is going on here is the browser to treating our class like a mixin, combining it's functionality with that of the default button element.

### Compatibility with JavaScript frameworks

Support for customized built-in elements is shaky in various JavaScript frameworks. Angular for instance doesn't handle this special use case for the 'is' attribute and doesn't compile the customized built-in element as you might expect. This is a tricky use case, because the browser interprets the 'is' attribute as the document is rendered, not after a JavaScript framework bootstraps or adds DOM to the document. IMHO JavaScript frameworks should also interpret the 'is' attribute, as customized built-in elements promote accessibility which is at times lost in the development process.

### Dynamic customized built-in elements

To overcome this limitation if it exists in your framework of choice, you could dynamically create a customized built-in element and add it to your template using `document.createElement`. This method takes a second argument that lets the browser interpret this new element as an instance of our `MyButton` class.

```javascript
const myButtonInstance = document.createElement("button", { is: "my-button" });
this.template.appendChild(myButtonInstance);
```

This approach has some limitations if the framework needs to bind to the custom element's attributes or content, but nonetheless this method works to render customized built-in elements dynamically.

### Browser compatibility

As of March 2019, evergreen browsers partially support the custom elements v1 spec, preferring autonomous custom elements over customized built-in elements. Only Chrome and Firefox support customized built-in elements out of the box. Microsoft has scoped support in Edge, however WebKit is vowing never to support this spec. This is a shame really. This engineer can't really grasp why Apple would hold back an API that is so helpful for implementing accessibility on the web. For browsers that do not support customized built-in elements, this [polyfill](https://github.com/ungap/custom-elements-builtin) is required.

### Conclusion

By making our web applications more accessible we open up the internet to people who can't navigate with a mouse or touch device. Imagine if you could only use a keyboard to navigate a web app or could only navigate around with voice commands. It would be a frustrating mess if you couldn't effectively use the web app. Customized built-in elements allow you to mixin functionality with elements that already provide features for accessibility. Use customized built-in elements in the course of developing web apps to make the internet a more accessible place.
