import { db, Data } from '../db/index.js';

class MetaController {
  get(req, res) {
    const { meta } = db.data as Data;
    res.status(200).send(JSON.stringify(meta));
  }
}

export { MetaController };
