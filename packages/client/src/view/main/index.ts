import { html, css, joinTemplates } from '../../util/template.js';
import {
  styles as appHeaderStyles,
  template as appHeaderTemplate,
  AppHeader,
} from '../../component/header/Header.js';
import {
  styles as appCardStyles,
  template as appCardTemplate,
  AppCard,
} from '../../component/card/Card.js';
import { Meta, Post } from '../../../../server/src/db/index.js';

export type DataModel = {
  meta: Meta;
  posts: Array<Post>;
};

const styles = css`
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

const shadowTemplate = () => html`<style>
    ${styles}
  </style>
  <div class="post-container">
    <app-header></app-header>
  </div>`;

const template = (data: DataModel) => html`<main-view>
  <template shadowrootmode="open">
    <style>
      ${styles}
    </style>
    <div class="post-container">
      ${appHeaderTemplate({ styles: appHeaderStyles, title: data.meta.title })}
      ${joinTemplates(
        data.posts.map(
          (post) =>
            `${appCardTemplate({
              styles: appCardStyles,
              headline: post.title,
              content: post.excerpt,
              thumbnail: post.thumbnail,
              link: post.slug,
            })}`
        )
      )}
    </div>
  </template>
</main-view>`;

function fetchModel(): Promise<DataModel> {
  return Promise.all([
    fetch('http://localhost:4444/api/meta'),
    fetch('http://localhost:4444/api/posts'),
  ])
    .then((responses) => Promise.all(responses.map((res) => res.json())))
    .then((jsonResponses) => {
      const meta = jsonResponses[0];
      const posts = jsonResponses[1].posts;
      return {
        meta,
        posts,
      };
    });
}

class MainView extends HTMLElement {
  constructor() {
    super();
    if (!this.shadowRoot) {
      const shadowRoot = this.attachShadow({ mode: 'open' });
      const template = document.createElement('template');
      template.innerHTML = shadowTemplate();
      shadowRoot.appendChild(template.content.cloneNode(true));
    }
  }
}
customElements.define('main-view', MainView);

export { template, fetchModel, AppCard, AppHeader, MainView };
