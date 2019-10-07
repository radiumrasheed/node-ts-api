import * as AWS from 'aws-sdk';
import config from './config';

// configuring the AWS environment
AWS.config.update({
  accessKeyId: config.accessKeyId,
  secretAccessKey: config.secretAccessKey,
});


export default new AWS.S3();
