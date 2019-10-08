import { Express } from 'express';
import { indexController } from '../controllers/index.server.controller';
import auth from './../middleware/auth'

export default class IndexRoute {
  constructor(app: Express) {
    app.use(auth);

    app.route('/').get(indexController.index);
    app.route('/msg').get(indexController.msg);
  }
}
