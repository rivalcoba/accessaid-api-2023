// Project dependencies
import path from 'path';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import mongoose from 'mongoose';
import httpStatus from 'http-status';

// Production Only Depenencies
import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import logger from './winston';

import constants from './constants';

export default (app) => {
  // Middlewares are applied depending on the context
  // *** Defatul Middlewares ***
  // view engine setup
  app.set('views', path.join(__dirname, '..', 'views'));
  app.set('view engine', 'hbs');
  // Parsers
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  // Static Server
  app.use(express.static(path.join(__dirname, '..', '..', 'public')));

  app.use(morgan('dev', { stream: logger.stream }));

  // Development Middlewares
  if (constants.ENV === 'development') {
    logger.info('EXCECUTION MODE: 🛠 DEVELOPMENT 🛠');
  }
  // Production Middlewares
  if (constants.ENV === 'production') {
    logger.info('EXCECUTION MODE: 🏭 PRODUCTION 🏭');
    app.use(compression());
    app.use(helmet());
  }

  // Checking databse connection middleware
  app.use((req, res, next) => {
    if (mongoose.connection.readyState === 1) {
      logger.info('✅ Pass database 🛢 connection checking');
      next();
    } else {
      res
        .status(httpStatus.SERVICE_UNAVAILABLE)
        .json({ message: 'App out of service' });
    }
  });

  return app;
};
