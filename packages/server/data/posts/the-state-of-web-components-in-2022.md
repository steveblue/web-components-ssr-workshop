---
title: The State of Web Components in 2022
slug: the-state-of-web-components-in-2022
thumbnail: https://res.cloudinary.com/practicaldev/image/fetch/s--rszmss8h--/c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000/https://dev-to-uploads.s3.amazonaws.com/uploads/articles/kcdpqqjfstxenxr6xs90.jpeg
author: Myself
excerpt: I review the current level of adoption for Web Components, the top libraries and tooling available, and browser support...
---

While writing [a book about Web Components](https://www.newline.co/courses/fullstack-web-components?utm_source=dev.to), I found nothing in my research that described the current state of the Web Components ecosystem. In this post, I hope to clear up any misconceptions about Web Components and provide several links to resources about Web Components. I'll review the current level of adoption, the top libraries and tooling available, and the browser support for the set of specifications known as Web Components.

## TLDR;

- ~18% of page loads [tracked by Google](https://chromestatus.com/metrics/feature/timeline/popularity/1689) contain a Web Component
- [Stencil](https://www.npmjs.com/package/@stencil/core) is the most downloaded library for developing Web Components
- [Custom Elements Manifest](https://github.com/open-wc/custom-elements-manifest) powers documentation for [Storybook](https://storybook.js.org/docs/web-components/get-started/introduction) where Web Components became a first-class citizen in 2021
- Several online communities about Web Components sprung up during the pandemic including this [Forem instance devoted to Web Components](https://community.webcomponents.dev)

## Adoption

Web Components have been growing in popularity among web developers ever since Custom Elements v1 became available in every evergreen browser: Chrome, Safari, Firefox, and Edge. According to [Google](https://www.youtube.com/watch?v=YBwgkr_Sbx0), in 2019 “> 5% of page loads use a Web Component”. Today, [Chrome Platform Status](https://chromestatus.com/metrics/feature/timeline/popularity/1689) reveals that ~18% of page loads tracked by Google contain a Web Component. This statistic is derived by pages that register a custom element on the [CustomElementRegistry](https://developer.mozilla.org/en-US/docs/Web/API/CustomElementRegistry).

## Libraries and Tooling

Over the years several libraries that enable Web Component development have appeared. [https://webcomponents.dev](https://webcomponents.dev) tracks [61 variants of a single component](https://webcomponents.dev/blog/all-the-ways-to-make-a-web-component/) coded with Web Component specifications. [divriots](https://divriots.com), a company that "builds great software to empower front-end teams", analyzes bundle size and performance of several Web Component libraries and publishes the findings in a semi-annual blog post titled "All the Ways to Make a Web Component".

- 4 variants render faster than the same component coded with Svelte
- 5 variants have a bundle size smaller than the same component coded with Svelte
- 54 variants coded with custom elements have a bundle-size smaller and render faster than the same component coded with React or Vue

### Top Five Web Component Libraries By Downloads

The following JavaScript libraries are ranked by weekly npm downloads. These libraries either use Web Components "under the hood" or compile down to Web Components.

1. [Stencil](https://www.npmjs.com/package/@stencil/core) - 357,795
2. [Lit](https://www.npmjs.com/package/lit) - 282,068
3. [FAST](https://www.npmjs.com/package/@microsoft/fast-element) - 37,489
4. [Lightning Web Components](https://www.npmjs.com/package/@lwc/compiler) - 35,452
5. [Solid](https://www.npmjs.com/package/solid-js) - 26,261

- Weekly downloads sourced from npm on June 24, 2022.

### Tooling

In the past year, Web Components became [a first-class citizen in Storybook](https://storybook.js.org/docs/web-components/get-started/introduction).

[Custom Elements Manifest](https://github.com/open-wc/custom-elements-manifest) is "a file format that describes custom elements". The [@custom-elements-manifest/analyzer](https://github.com/open-wc/custom-elements-manifest/tree/master/packages/analyzer) package generates a JSON file that can provide rich information about Web Components. Storybook uses this tool to generate documentation of Web Components.

## Browser Support

Every major browser supports custom elements according to [caniuse.com](https://caniuse.com/custom-elementsv1), with the exception that Apple Safari doesn't support customized built-in elements. Web Components is a set of specifications that include custom elements, Shadow DOM, and HTML templates. caniuse.com uses an outdated marketing term (custom elements v1) for the specifications that allow new HTML tags to be defined, which should probably be known as "custom elements". v1 differentiates the specifications from the prototypical version of custom elements (v0) that have been deprecated since 2014. This marketing term is confusing, mostly because HTML is a living document. caniuse.com also doesn't track some specifications related to Web Components, which may confuse newcomers.

The [HTML Living Standard](https://html.spec.whatwg.org/multipage/custom-elements.html#custom-elements) provides documentation for custom elements, including the three main types: autonomous, customized built-in, and form-associated custom elements. Custom elements are one part of the specifications that comprise Web Components, along with Shadow DOM and HTML templates. Other specifications enhance Web Components in some way, like CSS custom properties, but are not under the umbrella of Web Components. Below each specification is described, along with the level of browser support.

[Autonomous custom elements](https://html.spec.whatwg.org/multipage/custom-elements.html#autonomous-custom-element) allow engineers to define custom HTML elements. Autonomous custom elements have shipped in every modern browser.

[Customized built-in elements](https://html.spec.whatwg.org/multipage/custom-elements.html#custom-elements-customized-builtin-example) allow reuse of behaviors from existing HTML elements, which can be a boon for Accessibility in some use cases. Customized built-in elements are available in every modern browser except Apple Safari. A WebKit representative has said in the past [WebKit will never support customized built-in elements](https://github.com/WICG/webcomponents/issues/544#issuecomment-239301184). WebKit has supported autonomous custom elements and other Web Components specifications including HTML templates and Shadow DOM since 2019. Despite marketing that suggests Safari is either [on par](https://twitter.com/jensimmons/status/1513960262923137040?s=20&t=3e51Xdx8YQ-zuUVzVCi8Yw) or [leading](https://twitter.com/jensimmons/status/1513960262923137040?s=20&t=3e51Xdx8YQ-zuUVzVCi8Yw) in support for specifications, WebKit drags behind other browsers in terms of supporting Web Components. A [polyfill](https://github.com/ungap/custom-elements-builtin) exists for customized built-ins that is necessary for Apple Safari.

[Form-associated custom elements](https://html.spec.whatwg.org/multipage/custom-elements.html#custom-elements-face-example) enable custom elements to participate in the HTML form lifecycle. This specification allows developers to make entirely new form controls, or when inputs are embedded or Shadow DOM, overcome issues that block form controls from reporting validity and value to `HTMLFormElement`, while also enabling Accessibility. form-associated custom elements are available in Chrome, Edge, and Firefox Developer Edition. There is [some evidence](https://bugs.webkit.org/show_bug.cgi?id=197960) form-associated custom elements will be available in WebKit in the future. A [polyfill](https://github.com/calebdwilliams/element-internals-polyfill) exists for browsers that have not implemented form-associated custom elements.

[Shadow DOM](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM) provides encapsulation for HTML markup and styling for custom elements. Shadow DOM is available in every modern browser.

[HTML Templates](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template) is a way to cache HTML in DOM that isn't immediately rendered but can be reused for use in the document. HTML templates are available in every modern browser.

[CSS custom properties](https://developer.mozilla.org/en-US/docs/Web/CSS/--*), otherwise known as CSS variables, are a viable means to provide "design tokens" that cross the Shadow boundary. While not necessarily considered a Web Component specification, CSS custom properties allow engineers to essentially reuse styling in custom elements that employ Shadow DOM. CSS custom properties are found in every modern browser.

[CSS Shadow Parts](https://www.w3.org/TR/css-shadow-parts-1/) allow shadow hosts to "selectively expose chosen elements from their shadow tree to the outside page for styling purposes." CSS Shadow Parts are useful for theming or other style customizations in custom elements that use Shadow DOM. CSS Shadow Parts are in every modern browser.

## Specification Proposals

Web Components are a set of browser specifications. Spec is introduced over time: proposed, iteration upon, developed, and integrated into browsers. Web Components specifications are maintained and proposed in several places. An index is found on [Web Incubator CG Github repository README.md](https://github.com/WICG/webcomponents).

Various specifications are in some stage of the proposal process that impacts Web Components. Those specifications are described below.

### Declarative Shadow DOM

In early 2020, an explainer for [Declarative Shadow DOM](https://github.com/mfreed7/declarative-shadow-dom/blob/master/README.md) was introduced, a specification that enables Shadow DOM to be declared in an HTML template, rather than imperatively in a JavaScript class definition. Declarative Shadow DOM enables the server-side rendering of custom elements. Since then, Google Chrome and Microsoft Edge have implemented Declarative Shadow DOM. A [ponyfill](https://web.dev/declarative-shadow-dom/#polyfill) is required for the specification in Mozilla Firefox and Apple Safari.

In [Mozilla's vision for the evolution of the web](https://webvision.mozilla.org/full/#thedeclarativeweb), the foundation sees "room for improving or adding primitives that provide declarative alternatives for situations that currently require JavaScript". This indicates Mozilla is likely to implement specifications such as Declarative Shadow DOM, as do comments like [this one](https://github.com/whatwg/dom/pull/892#issuecomment-1087510456), although Mozilla has been [critical of the specification](https://mozilla.github.io/standards-positions/#declarative-shadow-dom) in the past. WebKit has not signaled support for Declarative Shadow DOM. Progress on Declarative Shadow DOM can be tracked [here](https://github.com/whatwg/dom/pull/892) and [here](https://github.com/whatwg/dom/issues/831).

It is worth noting that [Lit](https://github.com/lit/lit) has moved forward with providing a package named [@lit-labs/ssr that server-side renders custom elements](https://github.com/lit/lit/tree/main/packages/labs/ssr) and makes heavy use of Declarative Shadow DOM.

### Constructable Stylesheets

In 2018, an explainer was introduced for [Constructable Stylesheets](https://github.com/WICG/construct-stylesheets/blob/main/explainer.md). Constructable Stylesheets allow users to compose CSS styles programmatically without the need for a `<style>` tag. This promotes the reuse of CSS styles, helping to solve a problem common in UI library development where the same CSS is repeated throughout the codebase. Constructable Stylesheets operate across shadow boundaries, replacing the need for CSS selectors in earlier versions of Web Components specifications (/deep/, >>> and ::shadow). Constructable Stylesheets are currently available in Google Chrome and Microsoft Edge. A [polyfill](https://github.com/calebdwilliams/construct-style-sheets) exists for browsers that omit the spec.

Mozilla is [currently implementing Constructable Stylesheets](https://bugzilla.mozilla.org/show_bug.cgi?id=1520690) for Mozilla Firefox. WebKit has not signaled support for the specification.

### HTML Template Instantiation

[HTML Template Instantiation](https://github.com/WICG/webcomponents/blob/159b1600bab02fe9cd794825440a98537d53b389/proposals/Template-Instantiation.md) was proposed by Apple in 2017. HTML Template Instantiation would allow HTML templates to instantiate "with some parts of it substituted, conditionally included, or repeated based on JavaScript values", similar to the syntax available in Angular, Vue, or Ember. A [ponyfill](https://github.com/github/template-parts) exists, despite a complete lack of browser support.

### Other Specifications

Web Components specifications early in the proposal process include [Partial Hydration](https://github.com/webcomponents-cg/community-protocols/issues/30), [Pending Task Protocol](https://github.com/webcomponents-cg/community-protocols/blob/main/proposals/pending-task.md), and [Context Protocol](https://github.com/webcomponents-cg/community-protocols/blob/main/proposals/context.md).

For further reading about upcoming specifications, read the [Web Components Community Group 2021 Spec / API Status Document](https://w3c.github.io/webcomponents-cg/#cross-root-aria).

## Community

Despite a global pandemic, the growing popularity of Web Components has spurred a community surrounding Web Components to start forming.

The [Web Components Community Group](https://web-components-cg.netlify.app) aids with "collaboration between people working on web components libraries, tools, documentation, and standards". This group helps advance standards, organize conferences and meetups, and much more. A [Slack](webcomponentcommunity.slack.co) organization exists for Web Components where engineers can organize.

A [Forem instance devoted to Web Components](https://community.webcomponents.dev) became available in 2022.

This [Web Components Twitter Community](https://twitter.com/i/communities/1509750356040994816) was formed in 2022.

[Reddit has featured a Web Component community](https://www.reddit.com/r/WebComponents/) for some time.

## Fullstack Web Components

![Fullstack Web Components Book Cover](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/8c8ay4z15a63g6cp7ykl.jpeg)

Are you looking to code Web Components now, but don't know where to get started? I wrote a book titled [Fullstack Web Components](https://www.newline.co/courses/fullstack-web-components?utm_source=dev.to), a hands-on guide to coding UI libraries and web applications with custom elements. In Fullstack Web Components, you'll...

- Code several components using autonomous, customized built-in, and form-associated custom elements, Shadow DOM, HTML templates, CSS variables, and Declarative Shadow DOM
- Develop a micro-library with TypeScript decorators that streamlines UI component development
- Learn best practices for maintaining a UI library of Web Components with Storybook
- Code an application using Web Components and TypeScript

[Fullstack Web Components is available now at newline.co](https://www.newline.co/courses/fullstack-web-components?utm_source=dev.to)
