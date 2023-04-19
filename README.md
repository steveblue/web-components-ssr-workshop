# web-components-ssr-workshop

[Edit on StackBlitz ⚡️](https://stackblitz.com/edit/node-so8wkd)

Supporting blog post on [dev.to](https://dev.to/steveblue/server-side-rendering-a-blog-with-web-components-3ije).

This is the finished codebase, for the starter code visit [this repository](https://github.com/steveblue/web-components-ssr-workshop-starter). 


## Installation

This repository uses Lerna and Nx.

For the code to run, you need to generate a token for the Github API. 

Open packages/client/src/view/post/index.ts and replace `{{github_token}}` with [a token generated from GitHub](https://github.com/settings/tokens?type=beta)


```
npm install
```

## Development

```
npm run dev
```

Open a web browser, preferably one that supports Declarative Shadow DOM. Visit http://localhost:4444


## Build

```
npm run build
```

## Serve Production (optimized for performance)

```
npm run serve
```