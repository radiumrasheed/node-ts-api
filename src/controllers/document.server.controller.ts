import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import S3 from './../config/aws';
import config from '../config/config';
import Logger from './../config/logger';

const { error, debug } = Logger('document-controller');

export default class DocumentController {


  public index(req: AuthenticatedRequest, res: Response): void {
    S3.listObjects({
      Bucket: config.bucketName,
      Prefix: `users/${ req.user.userId }`
    }, (err, response) => {
      res.json(response.Contents);
    });
  }


  public listClientDocs(req: AuthenticatedRequest, res: Response): void {
    const { clientId } = req.params;

    if (!clientId) {
      res.status(400).send({ ok: false, message: 'No client specified' });
      return;
    }

    S3.listObjects({
      Bucket: config.bucketName,
      Prefix: `clients/${ clientId }`
    }, (err, response) => {
      res.json(response.Contents);
    });
  }


  uploadClientDoc(req: AuthenticatedRequest, res: Response): void {
    const { clientId } = req.params;

    if (!clientId) {
      res.status(400).send({ ok: false, message: 'No client specified' });
      return;
    }

    if (!req.files || req.files.length < 1) {
      res.status(400).send({ok: false, message: 'No file selected'});
      return;
    }

    S3.upload({
      Bucket: config.bucketName,
      Key: `clients/${ clientId }/${req.files[0].originalname}`,
      Body: req.files[0].buffer
    }, (err, response) => {
      if (err) {
        error(err.message, err);
        return res.status(400).send({ ok: false, message: 'Upload failed' });
      }

      return res.send(response);
    });

  }

}

export const documentController = new DocumentController();
