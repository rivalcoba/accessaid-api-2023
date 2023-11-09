// Importando el core de winston
// y la función format de winston
import winston, { format } from 'winston';
import appRootPath from 'app-root-path';

// Se desestructuran funciones para realizar la
// composición del formato
const { combine, timestamp, label, printf, colorize, prettyPrint } = format;

// Se define un esquema de colores
// segun el grado de severidad
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'blue',
};

// Agregando el esquema de colores a Winston
winston.addColors(colors);

// ==== Se crean las plantillas para los formatos ====

// Formato para la consola
const myConsoleFormat = combine(
  // Agregando colores la formato
  colorize({ all: true }),
  // Agregando una etiqueta al log
  label({ label: '📣' }),
  // Agregando Fecha
  timestamp({ format: 'DD-MM-YYYY HH:mm:ss' }),
  // Función de impreson
  printf(
    (info) => `${info.level}: ${info.label}: ${info.timestamp}: ${info.message}`
  )
);

// Formato para los archivos
const myFileFormat = combine(
  // Quitando todo tipo de colorizacion
  format.uncolorize(),
  // Agregando fecha
  timestamp({ format: 'DD-MM-YYYY HH:mm:ss', tz: 'America/Mexico_City' }),
  // Estableciendo la salida en formato Json
  prettyPrint()
);

// Creando el objeto de opciones para cada transporte
const options = {
  infoFile: {
    level: 'info',
    filename: `${appRootPath}/logs/info.log`,
    handleExceptions: false,
    maxSize: 5242880, // 5MB
    maxFiles: 5,
    format: myFileFormat,
  },
  warnFile: {
    level: 'warn',
    filename: `${appRootPath}/logs/warn.log`,
    handleExceptions: false,
    maxSize: 5242880, // 5MB
    maxFiles: 5,
    format: myFileFormat,
  },
  errorFile: {
    level: 'error',
    filename: `${appRootPath}/logs/error.log`,
    handleExceptions: false,
    maxSize: 5242880, // 5MB
    maxFiles: 5,
    format: myFileFormat,
  },
  console: {
    level: 'debug',
    handleExceptions: true,
    format: myConsoleFormat,
  },
};

// Se crea instancia de logger
const logger = winston.createLogger({
  timezone: 'America/Mexico_City',
  transports: [
    new winston.transports.File(options.infoFile),
    new winston.transports.File(options.warnFile),
    new winston.transports.File(options.errorFile),
    new winston.transports.Console(options.console),
  ],
  exitOnError: false, // No finaliza en excepciones no manejadas
});

logger.stream = {
  write(message) {
    logger.info(message);
  },
};

// Por ultimo exportamos el logger
export default logger;
