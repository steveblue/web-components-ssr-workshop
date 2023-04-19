import { template as mainTemplate } from './view/main/index.js';
import { template as postTemplate } from './view/post/index.js';

export type Route = {
  component: string;
  path?: string;
  pathMatch?: RegExp;
  tag: string;
  template: (data: any) => string;
  title?: string;
  params?: any;
};

export type Routes = Array<Route>;

export const routes: Routes = [
  {
    path: '/',
    component: 'main',
    tag: 'main-view',
    template: mainTemplate,
  },
  {
    pathMatch: /\/post\/([a-zA-Z0-9-]*)/,
    component: 'post',
    tag: 'post-view',
    template: postTemplate,
  },
];
