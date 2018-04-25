'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _core = require('./db/core');

var _core2 = _interopRequireDefault(_core);

var _routes = require('./routes');

var _routes2 = _interopRequireDefault(_routes);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

/*
* @Author: perry
* @Date:   2018-03-14 09:38:05
* @Last Modified by:   perry
* @Last Modified time: 2018-04-03 14:50:28
*/
const helmet = require('helmet');

const app = (0, _express2.default)();
const isProduction = process.env.NODE_ENV === 'production';
const port = isProduction ? process.env.PORT || 6554 : process.env.PORT || 6554;

const publicPath = _path2.default.resolve(__dirname, '../public/');
app.use(helmet());
app.use(_express2.default.static(publicPath));
app.use(_bodyParser2.default.urlencoded({ extended: false }));
app.use(_bodyParser2.default.json());
app.use('/api', _routes2.default);

const server = _http2.default.createServer(app);
server.listen(port);

console.log('server listening on:', port);
