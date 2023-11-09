import express from 'express';

// Middlewares
import middlewares from './config/middlewares';

// Importing Routes
import addroutes from './routes';

// Creating Backend Instance
const app = express();

// Setting up middlewares
middlewares(app);

// Adding Routes
addroutes(app);

export default app;
