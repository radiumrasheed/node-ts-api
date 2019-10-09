'use strict';

import * as CloudWatchTransport from 'winston-aws-cloudwatch';
import * as Winston from 'winston';
import config from './config';

const NODE_ENV = process.env.NODE_ENV || 'development';
let transport;
if (NODE_ENV === 'development') {
  transport = new Winston.transports.Console({
    format: Winston.format.combine(
      Winston.format.colorize(),
      Winston.format.timestamp(),
      Winston.format.align(),
      Winston.format.metadata({
        fillWith: ['error', 'user']
      }),
      Winston.format.printf(info => `${ info.level }[${ info.label }]: ${ info.message } ${ JSON.stringify(info.meta) }`)
    )
  });
} else {
  transport = new CloudWatchTransport({
    logGroupName: 'fccc-doc-api',
    logStreamName: NODE_ENV,
    createLogGroup: false,
    createLogStream: true,
    awsConfig: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
      region: config.region
    }
  });
}

const Logger = Winston.createLogger({
  transports: [transport],
  level: process.env.LOG_LEVEL || 'silly'
});



const Proxify = (logger: Winston.Logger, group: string) => new Proxy(logger, {
  get(target, propKey: string) {
    if (['error', 'debug'].indexOf(propKey) > -1) {
      return (...args) => {
        let message;
        [message, ...args] = args;
        return target.log({ label: group, message: message, level: propKey, meta: args || undefined });
      };
    } else {
      return target[propKey];
    }
  }
});

/*
  How to use...

  import Logger from './../config/logger';
  const { debug, error } = Logger('<group_name>');
  error('Sample Error Message', { stackTrace: error.stack });
  debug('Sample Debug Message');
*/
export default group => Proxify(Logger, group);
