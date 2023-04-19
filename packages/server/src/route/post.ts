import { db, Data, Meta, Post } from '../db/index.js';
import { join } from 'path';
import { readFileSync, readdirSync } from 'fs';
import matter from 'gray-matter';

const postDirectory = join(process.cwd(), 'data', 'posts');

function fetchPost(slug: string): any | null {
  const fileName = `${slug}.md`;
  const fullPath = join(postDirectory, fileName);
  let fileContents;
  try {
    fileContents = readFileSync(fullPath, 'utf8');
  } catch (err) {
    return null;
  }
  const post = matter(fileContents);
  return {
    content: post.content,
    ...post.data,
  };
}

function fetchPosts(): Array<Post> {
  return readdirSync(postDirectory).map((file) => {
    return fetchPost(file.replace('.md', ''));
  });
}

class BlogController {
  getPost(req, res) {
    const post = fetchPost(req.params.slug);
    if (post) {
      res.status(200).send(
        JSON.stringify({
          meta: (db.data as Data).meta,
          post,
        })
      );
    } else {
      res.status(404).send();
    }
  }
  getPosts(req, res) {
    res.status(200).send(
      JSON.stringify({
        meta: (db.data as Data).meta,
        posts: fetchPosts(),
      })
    );
  }
}

export { BlogController };
