import { BlogController } from '../route/post.js';
import { MetaController } from '../route/meta.js';
import express from 'express';

const apiRouter = express.Router();
const blogController = new BlogController();
const metaController = new MetaController();

apiRouter.get('/post/:slug', blogController.getPost);
apiRouter.get('/posts', blogController.getPosts);
apiRouter.get('/meta', metaController.get);

export default apiRouter;
