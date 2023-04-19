import { html, css } from '../../util/template.js';

const styles = css`
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

const title = 'Web Components Blog';

const shadowTemplate = ({ styles, title }) => html`
  <style>
    ${styles}
  </style>
  <h1>${title}</h1>
`;

const template = ({ styles, title }) => html`<app-header>
  <template shadowrootmode="open"
    >${shadowTemplate({
      styles,
      title,
    })}</template
  >
</app-header>`;

class AppHeader extends HTMLElement {
  constructor() {
    super();
    if (!this.shadowRoot) {
      const shadowRoot = this.attachShadow({ mode: 'open' });
      const template = document.createElement('template');
      template.innerHTML = shadowTemplate({ styles, title });
      shadowRoot.appendChild(template.content.cloneNode(true));
    }
  }
}

customElements.define('app-header', AppHeader);

export { template, styles, title, AppHeader };
