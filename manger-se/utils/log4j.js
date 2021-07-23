/**
 * 日志存储
 * @author Gonwe
 */
const log4js = require("log4js");

const levels = {
  trace: log4js.levels.TRACE,
  debug: log4js.levels.DEBUG,
  info: log4js.levels.INFO,
  warn: log4js.levels.WARN,
  error: log4js.levels.ERROR,
  fatal: log4js.levels.FATAL,
};

log4js.configure({
  appenders: {
    console: { type: "console" },
    info: { type: "file", filename: "./logs/fileout.log" },
    error: {
      type: "dateFile",
      filename: "./logs/error",
      pattern: "yyyy-MM-dd-hh.log",
      alwaysIncludePattern: true, //filename+pattern
    },
  },
  categories: {
    default: { appenders: ["console"], level: "debug" },
    info: { appenders: ["console", "info"], level: "info" },
    error: { appenders: ["console", "error"], level: "error" },
  },
});

/**
 * 日志输出，level为debug
 * @param {string} context
 */
exports.debug = (context) => {
  let logger = log4js.getLogger();
  logger.level = levels.debug;
  logger.debug(context);
};
/**
 * 日志输出，level为info
 * @param {string} context
 */
exports.info = (context) => {
  let logger = log4js.getLogger("info");
  logger.level = levels.info;
  logger.info(context);
};
/**
 * 日志输出，level为error
 * @param {string} context
 */
exports.error = (context) => {
  let logger = log4js.getLogger("error");
  logger.level = levels.error;
  logger.error(context);
};
