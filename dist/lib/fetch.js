'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

exports.default = fetch;

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _lodash = require('lodash');

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

/*
* @Author: perry
* @Date:   2018-03-15 16:06:42
* @Last Modified by:   perry
* @Last Modified time: 2018-03-28 22:39:37
*/
const localFetch = options => {
  let { method = 'get', data, url } = options;

  const cloneData = (0, _lodash.cloneDeep)(data);

  switch (method.toLowerCase()) {
    case 'get':
      return _axios2.default.get(url, {
        params: cloneData
      });
    case 'delete':
      return _axios2.default.delete(url, {
        params: cloneData
      });
    case 'post':
      return _axios2.default.post(url, cloneData);
    case 'put':
      return _axios2.default.put(url, cloneData);
    case 'patch':
      return _axios2.default.patch(url, cloneData);
    default:
      return (0, _axios2.default)(options);
  }
};
// {
//     // headers: {'x-access-token': localStorage.getItem('token')},
//   }
function fetch(options) {
  const opt = (0, _assign2.default)(options);
  return localFetch(opt)
    .then(response => {
      const data = response.data;
      if (response.status >= 200 && response.status < 300) {
        return data;
      }
    })
    .catch(error => {
      const { response } = error;
      let msg;
      let statusCode;
      if (response && response instanceof Object) {
        const { data, statusText } = response;
        statusCode = response.status;
        msg = data.message || statusText;
      } else {
        statusCode = 600;
        msg = error.message || '网络错误';
      }
      return response;
      // res.status(500).send(response);
      // return { success: false, statusCode, message: msg }
    });
}
