/*
* @Author: perry
* @Date:   2018-03-15 10:18:01
* @Last Modified by:   perry
* @Last Modified time: 2018-03-15 10:20:36
*/

var log4js = require('log4js');
// var logger = log4js.getLogger();
// logger.level = 'debug';

log4js.configure({
   appenders: {
     out: { type: 'stdout' },
     app: { type: 'file', filename: 'logs/application.log', maxLogSize: 10, backups: 4, compress: true  },
     everything: { type: 'dateFile', filename: 'logs/all-the-logs.log', pattern: '.yyyy-MM-dd', compress: true }
   },
   categories: {
     default: { appenders: [ 'out', 'app','everything'], level: 'debug' }
   }
});
var Logger = function(name) {
	name = name || ''
 	const logger = log4js.getLogger(name);
	return logger
}
//


// logger.trace('Entering cheese testing');
// logger.debug('Got cheese.');
// logger.info('Cheese is Gouda.');
// logger.warn('Cheese is quite smelly.');

// logger.fatal('Cheese was breeding ground for listeria.');

module.exports = Logger;