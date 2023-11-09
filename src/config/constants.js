// Importando el paquete Dotenv
import dotenv from 'dotenv';

// Cargando configuración del archivo ".env"
dotenv.config();

// Option Objets de configuracion
const devConfig = {
  MONGO_URL: process.env.MONGO_URL_DEV,
  JWT_SECRET: process.env.JWT_SECRET,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
};
const testConfig = {
  MONGO_URL: process.env.MONGO_URL_TEST,
};
const prodConfig = {
  MONGO_URL: process.env.MONGO_URL_PROD,
};

const defaultConfig = {
  PORT: process.env.PORT || 3000,
  ENV: process.env.NODE_ENV,
};

function envConfig(env) {
  switch (env) {
    case 'development':
      return devConfig;
    case 'test':
      return testConfig;
    default:
      return prodConfig;
  }
}

// Creating config object
export default {
  ...defaultConfig,
  ...envConfig(process.env.NODE_ENV),
};
