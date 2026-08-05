import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import config from "../config/index.js";

const customLevels = {
  fatal: 0,
  error: 1,
  warn: 2,
  info: 3,
  http: 4,
  debug: 5,
};

const consoleFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.printf(({ timestamp, level, message }) => {
    return `${timestamp} ${`[${level}]`.padEnd(10)}${message}`;
  }),
);

const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.json(),
);

const errorTransport = new DailyRotateFile({
  filename: "./logs/error.log",
  datePattern: "YYYY-MM-DD",
  level: "error",
  maxFiles: "15D",
  format: fileFormat,
});

export const logger = winston.createLogger({
  levels: customLevels,
  level: config.nodeEnv === "production" ? "info" : "debug",
  transports: [
    new winston.transports.Console({
      format: consoleFormat,
    }),
    errorTransport,
  ],
});
