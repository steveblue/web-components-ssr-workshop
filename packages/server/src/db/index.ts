import { join } from 'path';

import { Low, JSONFile } from 'lowdb';

const file = join(process.cwd(), 'data', 'db.json');
const adapter = new JSONFile(file);
const db = new Low(adapter);

export type Meta = {
  author: string;
  title: string;
};

export type Post = {
  content: string;
  slug: string;
  title: string;
  thumbnail: string;
  author: string;
  excerpt: string;
};

export type Data = {
  meta: Meta;
  posts: Array<Post>;
};

db.read();
db.data =
  (db.data as Data) ||
  ({
    meta: {},
    posts: [],
  } as Data);

export { db };
