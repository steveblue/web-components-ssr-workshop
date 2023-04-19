import { Octokit } from '@octokit/core';
import { html, css } from '../../util/template.js';
import {
  styles as appHeaderStyles,
  template as appHeaderTemplate,
  AppHeader,
} from '../../component/header/Header.js';
import { Meta, Post } from '../../../../server/src/db/index.js';

const octokit = new Octokit({
  auth: `{{github_token}}`,
});


export type DataModel = {
  meta: Meta;
  post: Post;
  html: any;
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
      width: 100%;
    }
    .post-content {
      padding-left: var(--padding-sm);
      padding-right: var(--padding-sm);
      margin-bottom: var(--margin-xl);
    }
  }
  @media (min-width: 721px) {
    .post-container {
      width: 720px;
      position: relative;
      left: 50%;
      transform: translateX(-50%);
    }
    .post-content {
      padding-left: var(--padding-lg);
      padding-right: var(--padding-lg);
      margin-bottom: var(--margin-xl);
    }
  }
`;

const shadowTemplate = () => html`<style>
    ${styles}
  </style>
  <div class="post-container">
    <app-header></app-header>
    <div class="post-content">
      <h2>Author: </h2>
      <footer>
        <a href="/">👈 Back</a>
      </footer>
    </div>
  </div>`;

const template = (data: DataModel) => html`<main-view>
  <template shadowrootmode="open">
    <style>
      ${styles}
    </style>
    <div class="post-container">
      ${appHeaderTemplate({ styles: appHeaderStyles, title: data.post.title })}
      <div class="post-content">
        <h2>Author: ${data.post.author}</h2>
        ${data.html}
        <footer>
          <a href="/">👈 Back</a>
        </footer>
      </div>
    </div>
  </template>
</main-view>`;

function fetchModel({ params }): Promise<any> {
  const res = async () => {
    const request = await Promise.all([
      fetch('http://localhost:4444/api/meta'),
      fetch(`http://localhost:4444/api/post/${params['slug']}`),
    ])
      .then((responses) => Promise.all(responses.map((res) => res.json())))
      .then((jsonResponses) => {
        return {
          meta: jsonResponses[0],
          post: jsonResponses[1].post,
        };
      });

    const postContentTemplate = await octokit.request('POST /markdown', {
      text: request.post.content,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28',
      },
    });
    return {
      ...request,
      html: postContentTemplate.data,
    };
  };
  return res().then((res) => {
    return res;
  });
}

class PostView extends HTMLElement {
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
customElements.define('post-view', PostView);

export { template, fetchModel, AppHeader, PostView };
