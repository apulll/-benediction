'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _wordFilter = require('../../config/wordFilter.js');

var _wordFilter2 = _interopRequireDefault(_wordFilter);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

const KeywordFilter = require('keyword-filter'); /*
                                                 * @Author: perry
                                                 * @Date:   2018-04-17 09:29:54
                                                 * @Last Modified by:   perry
                                                 * @Last Modified time: 2018-04-17 22:44:27
                                                 */

const Logger = require('../../lib/logger')('middlewares/word');

// const fs = require('fs');
// const path = require('path');

// const txtPath = path.resolve(__dirname, '../../config/keywords');

// const array = fs
// 	.readFileSync(txtPath)
// 	.toString()
// 	.split('\n');

// const write_path = path.resolve(__dirname, '../../config/word11.text');
// const write_path_exist = fs.existsSync(write_path);
// if (write_path_exist) {
// } else {
// 	const newArray = JSON.stringify(array);
// 	fs.writeFile(write_path, newArray);
// }
// Logger.info(array, 'array112289');

const keyArrays = _wordFilter2.default;

const filter = new KeywordFilter();
filter.init(keyArrays);

exports.default = filter;
