/*
* @Author: perry
* @Date:   2018-03-15 10:18:01
* @Last Modified by:   perry
* @Last Modified time: 2018-03-28 22:39:56
*/

var log4js = require("log4js");

log4js.configure({
  appenders: {
    out: { type: "stdout" },
    app: {
      type: "file",
      filename: "logs/application.log",
      maxLogSize: 1048576,
      backups: 4,
      compress: true
    },
    everything: {
      type: "dateFile",
      filename: "logs/all-the-logs.log",
      pattern: ".yyyy-MM-dd",
      compress: true
    }
  },
  categories: {
    default: {
      appenders: ["app", "everything"],
      level: process.env.NODE_ENV == "production" ? "info" : "debug"
    }
    // local: { appenders: ['app'], level: process.env.NODE_ENV == 'production' ? 'info' : 'debug' }
  },
  pm2: process.env.NODE_ENV == "production" ? true : false
});

var Logger = function(name) {
  name = name || "";
  const logger = log4js.getLogger(name);
  return logger;
};

module.exports = Logger;
