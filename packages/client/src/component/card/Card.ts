import { html, css } from '../../util/template.js';

const styles = css`
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

const shadowTemplate = ({ styles }) => html`
  <style>
    ${styles}
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

const template = ({
  content,
  headline,
  link,
  thumbnail,
  styles,
}) => html`<app-card>
  <template shadowrootmode="open"> ${shadowTemplate({ styles })} </template>
  <img slot="header" src="${thumbnail}" alt="${content}" />
  <h2 slot="header">${headline}</h2>
  <p slot="content">${content}</p>
  ${html`<a href="/post/${link}" slot="footer">Read Post</a>`}
</app-card>`;

class AppCard extends HTMLElement {
  constructor() {
    super();
    if (!this.shadowRoot) {
      const shadowRoot = this.attachShadow({ mode: 'open' });
      const template = document.createElement('template');
      template.innerHTML = shadowTemplate({ styles });
      shadowRoot.appendChild(template.content.cloneNode(true));
    }
  }
}

customElements.define('app-card', AppCard);

export { styles, template, AppCard };
