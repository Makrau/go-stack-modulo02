import express from 'express';
import path from 'path';
import * as Sentry from '@sentry/node';
import 'express-async-errors';
import Youch from 'youch';
import routes from './routes.js';
import sentryConfig from './config/sentry';
import './database/index';
import GoBarberError from './app/errors/GoBarberError';

class App {
  constructor() {
    this.server = express();

    Sentry.init(sentryConfig);

    this.middlewares();
    this.routes();
    this.exceptionHandler();
  }

  middlewares() {
    this.server.use(Sentry.Handlers.requestHandler());
    this.server.use(express.json());
    this.server.use(
      '/files',
      express.static(path.resolve(__dirname, '..', 'tmp', 'uploads'))
    );
  }

  routes() {
    this.server.use(routes);
    this.goBarberErrorHandler();
    this.server.use(Sentry.Handlers.errorHandler());
  }

  goBarberErrorHandler() {
    this.server.use(async (err, req, res, next) => {
      if (!(err instanceof GoBarberError)) {
        throw err;
      }

      const errorCode = err.code ? err.code : 400;
      return res.status(errorCode).json({ error: err.message });
    });
  }

  exceptionHandler() {
    this.server.use(async (err, req, res, next) => {
      const errors = await new Youch(err, req).toJSON();

      return res.status(500).json(errors);
    });
  }
}

export default new App().server;
