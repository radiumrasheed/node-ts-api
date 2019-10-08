import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import S3 from './../config/aws';
import config from '../config/config';

export default class DocumentController {
  public index(req: AuthenticatedRequest, res: Response): void {
    console.log(req.user);

    S3.listObjects({
      Bucket: config.bucketName,
      Prefix: `clients/${req.user.userId}`
    }, (error, response) => {
      res.json(response.Contents);
    });
  }

}

export const documentController = new DocumentController();
