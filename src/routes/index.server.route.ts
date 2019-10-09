import { Express } from 'express';
import { indexController } from '../controllers/index.server.controller';
import { documentController } from '../controllers/document.server.controller';
import auth from './../middleware/auth'
import * as multer from 'multer';
const Upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 2 * 1024 * 1024 } });

export default class IndexRoute {
  constructor(app: Express) {
    app.use(auth);
    app.use(Upload.any());

    app.route('/').get(indexController.index);

    app.route('/user').get(documentController.index);

    app.route('/client/:clientId').get(documentController.listClientDocs);
    app.route('/client/:clientId/upload').post(documentController.uploadClientDoc);
  }
}
