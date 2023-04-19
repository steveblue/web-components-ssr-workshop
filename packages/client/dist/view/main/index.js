// ../client/src/util/template.ts
var html = (strings, ...values) => String.raw({ raw: strings }, ...values);
var css = (strings, ...values) => String.raw({ raw: strings }, ...values);
function joinTemplates(templates) {
  return templates.join("");
}

// ../client/src/component/header/Header.ts
var styles = css`
  :host {
    display: block;
  }
  h1 {
    font-weight: var(--font-weight-headline);
  }
  @media (max-width: 720px) {
    :host {
      padding-left: var(--padding-sm);
      padding-right: var(--padding-sm);
    }
    h1 {
      font-size: var(--font-headline-lg);
    }
  }
  @media (min-width: 721px) {
    :host {
      padding-left: var(--padding-lg);
      padding-right: var(--padding-lg);
    }
    h1 {
      font-size: var(--font-headline-xl);
    }
  }
  @media (max-width: 280px) {
    h1 {
      font-size: var(--font-headline-md);
    }
  }
`;
var title = "Web Components Blog";
var shadowTemplate = ({ styles: styles4, title: title2 }) => html`
  <style>
    ${styles4}
  </style>
  <h1>${title2}</h1>
`;
var template = ({ styles: styles4, title: title2 }) => html`<app-header>
  <template shadowrootmode="open"
    >${shadowTemplate({
  styles: styles4,
  title: title2
})}</template
  >
</app-header>`;
var AppHeader = class extends HTMLElement {
  constructor() {
    super();
    if (!this.shadowRoot) {
      const shadowRoot = this.attachShadow({ mode: "open" });
      const template4 = document.createElement("template");
      template4.innerHTML = shadowTemplate({ styles, title });
      shadowRoot.appendChild(template4.content.cloneNode(true));
    }
  }
};
customElements.define("app-header", AppHeader);

// ../client/src/component/card/Card.ts
var styles2 = css`
  :host {
    display: block;
    background: var(--color-white);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-dialog);
    overflow: hidden;
  }
  ::slotted(*) {
    padding-left: var(--padding-lg);
    padding-right: var(--padding-lg);
  }
  ::slotted(a:link),
  ::slotted(a:visited) {
    display: block;
  }
  ::slotted(:last-child) {
    padding-bottom: var(--margin-lg);
  }
  ::slotted(img) {
    width: 100%;
    padding-left: 0px;
    padding-right: 0px;
  }
`;
var shadowTemplate2 = ({ styles: styles4 }) => html`
  <style>
    ${styles4}
  </style>
  <header>
    <slot name="header"></slot>
  </header>
  <section>
    <slot name="content"></slot>
  </section>
  <footer>
    <slot name="footer"></slot>
  </footer>
`;
var template2 = ({
  content,
  headline,
  link,
  thumbnail,
  styles: styles4
}) => html`<app-card>
  <template shadowrootmode="open"> ${shadowTemplate2({ styles: styles4 })} </template>
  <img slot="header" src="${thumbnail}" alt="${content}" />
  <h2 slot="header">${headline}</h2>
  <p slot="content">${content}</p>
  ${html`<a href="/post/${link}" slot="footer">Read Post</a>`}
</app-card>`;
var AppCard = class extends HTMLElement {
  constructor() {
    super();
    if (!this.shadowRoot) {
      const shadowRoot = this.attachShadow({ mode: "open" });
      const template4 = document.createElement("template");
      template4.innerHTML = shadowTemplate2({ styles: styles2 });
      shadowRoot.appendChild(template4.content.cloneNode(true));
    }
  }
};
customElements.define("app-card", AppCard);

// ../client/src/view/main/index.ts
var styles3 = css`
  :host {
    display: block;
  }
  .post-container {
    padding-bottom: var(--padding-xl);
  }
  a:link,
  a:visited {
    color: var(--color-blue-700);
    text-decoration: none;
  }
  @media (max-width: 720px) {
    .post-container {
      margin-left: var(--padding-sm);
      margin-right: var(--padding-sm);
    }
    app-card {
      margin-bottom: var(--margin-md);
    }
  }
  @media (min-width: 721px) {
    .post-container {
      width: 720px;
      position: relative;
      left: 50%;
      transform: translateX(-50%);
      padding-left: var(--padding-lg);
      padding-right: var(--padding-lg);
    }
    app-card {
      margin-bottom: var(--margin-lg);
    }
  }
`;
var shadowTemplate3 = () => html`<style>
    ${styles3}
  </style>
  <div class="post-container">
    <app-header></app-header>
  </div>`;
var template3 = (data) => html`<main-view>
  <template shadowrootmode="open">
    <style>
      ${styles3}
    </style>
    <div class="post-container">
      ${template({ styles, title: data.meta.title })}
      ${joinTemplates(
  data.posts.map(
    (post) => `${template2({
      styles: styles2,
      headline: post.title,
      content: post.excerpt,
      thumbnail: post.thumbnail,
      link: post.slug
    })}`
  )
)}
    </div>
  </template>
</main-view>`;
function fetchModel() {
  return Promise.all([
    fetch("http://localhost:4444/api/meta"),
    fetch("http://localhost:4444/api/posts")
  ]).then((responses) => Promise.all(responses.map((res) => res.json()))).then((jsonResponses) => {
    const meta = jsonResponses[0];
    const posts = jsonResponses[1].posts;
    return {
      meta,
      posts
    };
  });
}
var MainView = class extends HTMLElement {
  constructor() {
    super();
    if (!this.shadowRoot) {
      const shadowRoot = this.attachShadow({ mode: "open" });
      const template4 = document.createElement("template");
      template4.innerHTML = shadowTemplate3();
      shadowRoot.appendChild(template4.content.cloneNode(true));
    }
  }
};
customElements.define("main-view", MainView);
export {
  AppCard,
  AppHeader,
  MainView,
  fetchModel,
  template3 as template
};
