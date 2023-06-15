const winston = require("winston");
const _ = require("lodash");
const defaultConfig = require("../../configs/logger.default.config.json");

module.exports = class Logger {
  static #staticInstance = new Logger();

  #config;
  #logger;
  #commonTransports;

  constructor() {
    this.#config = defaultConfig;
    this.#logger = this.#createLogger();
  }

  /**
   * Log info message
   * @param {string} message Message to log
   */
  static info(message) {
    Logger.#staticInstance.info(message);
  }

  /**
   * Log error message
   * @param {string} message Message to log
   */
  static error(message) {
    Logger.#staticInstance.error(message);
  }

  /**
   * Log debug message
   * @param {string} message Message to log
   */
  static debug(message) {
    Logger.#staticInstance.debug(message);
  }

  /**
   * Log warning message
   * @param {string} message Message to log
   */
  static warn(message) {
    Logger.#staticInstance.warn(message);
  }

  /**
   * Log info message
   * @param {string} message Message to log
   */
  info(message) {
    this.#logger.info(message);
  }

  /**
   * Log error message
   * @param {string} message Message to log
   */
  error(message) {
    this.#logger.error(message);
  }

  /**
   * Log debug message
   * @param {string} message Message to log
   */
  debug(message) {
    this.#logger.debug(message);
  }

  /**
   * Log warning message
   * @param {string} message Message to log
   */
  warn(message) {
    this.#logger.warn(message);
  }

  #createLogger() {
    if (_.isNil(this.#logger)) {
      return winston.createLogger({
        format: winston.format.combine(
          winston.format.timestamp({
            format: this.#config.logTimestampFormat,
          }),
          Logger.#getLogFormat()
        ),
        transports: this.#getCommonTransports(),
      });
    } else {
      return this.#logger;
    }
  }

  static #getLogFormat() {
    return winston.format.printf(({ level, message, timestamp }) => {
      return `[${level.toUpperCase()}] ${timestamp} : ${message}`;
    });
  }

  #getCommonTransports() {
    if (_.isNil(this.#commonTransports)) {
      const transports = [];
      if (this.#config.consoleLog.enabled) {
        transports.push(new winston.transports.Console());
      }
      this.#commonTransports = transports;
    }
    return this.#commonTransports;
  }
};
