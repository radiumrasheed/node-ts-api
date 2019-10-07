import { sync } from 'glob';
import { union } from 'lodash';
import * as dotenv from 'dotenv';

class Config {
  public port: number = 3000;
  public routes: string = './dist/routes/**/*.js';
  public models: string = './dist/models/**/*.js';

  public accessKeyId: string;
  public secretAccessKey: string;

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

    this.accessKeyId = process.env.accessKeyId;
    this.secretAccessKey = process.env.secretAccessKey;

  }
}

export default new Config();
