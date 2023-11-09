import homeRouter from './modules/home/home.route';
import apiV1router from './modules/api/v1/api.v1.route';
import { error404, generalError } from './modules/error/error.controller';

export default function addRoutes(app) {
  // HOME
  // /
  app.use('/', homeRouter);

  // USER
  // /api/v1
  app.use('/api/v1', apiV1router);

  // 🚨🚨 ERROR SECTION 🚨🚨
  // Catch 404 and forward to error handler
  app.use(error404);

  // General Error Handler
  app.use(generalError);
}
