import { sync } from 'glob';
import { union } from 'lodash';
import * as dotenv from 'dotenv';

class Config {
  public port: number = 3000;
  public routes: string = './dist/routes/**/*.js';
  public models: string = './dist/models/**/*.js';

  public accessKeyId: string;
  public secretAccessKey: string;
  public region: string;
  public SECRET_KEY: string;

  public globFiles(location: string): string[] {
    return union([], sync(location));
  }


  constructor() {
    dotenv.config();
    let path;

    switch (process.env.NODE_ENV) {
      case 'test':
        path = `${ __dirname }/../../.env.test`;
        break;
      case 'production':
        path = `${ __dirname }/../../.env.production`;
        break;
      default:
        path = `${ __dirname }/../../.env.development`;
    }

    dotenv.config({ path: path });

    this.accessKeyId = process.env.AWS_ACCESS_KEY_ID;
    this.secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
    this.region = process.env.AWS_DEFAULT_REGION;
    this.SECRET_KEY = process.env.SECRET_KEY;

  }
}

export default new Config();
