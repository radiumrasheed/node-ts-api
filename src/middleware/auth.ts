'use strict';

import Logger from './../config/logger';
const { debug, error } = Logger('middleware');

import config from './../config/config';

import * as  jwt from 'jsonwebtoken';
import * as blueBird from 'bluebird';

blueBird.Promise.promisify(jwt.verify);

export default async(req, res, next) => {
  if (!req.headers.authorization) {
    error('Error: Authorization is not set in header');
    return res.status(401).send({
      status: 401,
      error: true,
      message: 'Please make sure your request has an Authorization header'
    });
  }

  const token = req.headers.authorization;
  try {
    const decoded = await jwt.verify(token, config.SECRET_KEY);
    debug('Authorization success');


    // if everything is good, save to request for use in other routes
    const { roles, iat, exp, ...user } = decoded;

    req.user = res.locals.user = user;
    req.roles = roles;

    return next();
  } catch (err) {
    error('Authentication failed', err);
    return res.status(401).send({
      status: 401,
      error: true,
      message: 'Failed to authenticate token',
    });
  }
};
