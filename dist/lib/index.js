'use strict';

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _word = require('../middlewares/word');

var _word2 = _interopRequireDefault(_word);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

/*
* @Author: perry
* @Date:   2018-03-14 10:57:49
* @Last Modified by:   perry
* @Last Modified time: 2018-04-20 22:45:26
*/
const crypto = require('crypto');
const base64url = require('base64-url');
const WXBizDataCrypt = require('./WXBizDataCrypt');
const _ = require('lodash');

exports.jsonFormatter = function(response, err = false, code = 200) {
  return {
    res: response.res || null,
    msg: response.msg || '成功！',
    errors: response.errors || [],
    status: !err,
    code
  };
};

exports.getDataFromReq = function(req) {
  const data = req.method === 'GET' || req.method === 'DELETE' ? req.query : req.body;
  return data;
};

exports.formatDataByCatalogId = function(results) {
  const data = JSON.parse((0, _stringify2.default)(results));
  const arrs = data[0].templates;
  const template_ids = _.map(arrs, 'id');

  return template_ids;
};

exports.formatPage = function(page = 1, per_page = 10, results) {
  const data = results.rows;
  const total = results.count;
  const newObj = {
    data,
    total,
    page,
    per_page
  };

  return newObj;
};
/**
 * 获取祝福列表页时数据处理
 * @param  {[type]} resource [description]
 * @param  {[type]} target   [description]
 * @return {[type]}          [description]
 */
exports.benisonAllDataFormat = function(resource, target) {
  let newRecource = {};
  let newRows = _.cloneDeep(resource.rows);
  newRows = _.map(newRows, function(value, key) {
    let newObj = _.cloneDeep(value);
    newObj = _.assign({}, newObj, { is_liked_bension: 0 });
    _.map(target, function(value2, key2) {
      if (value.id == value2.bension_id) {
        newObj = _.assign({}, newObj, {
          is_liked_bension: value2.is_liked_bension
        });
      }
    });

    return newObj;
  });
  newRecource = {
    count: resource.count,
    rows: newRows
  };
  return newRecource;
};
/**
 * 用户接收和创建的祝福数据处理
 */
exports.createAndRecieveBenisonFormat = function(resource) {
  let newRes = _.sortBy(_.cloneDeep(resource), ['template.catalog_id', 'updated_at']);
  let target = [];

  _.map(resource, function(value, key) {
    if (_.isEmpty(target)) {
      const newObj = _.assign({});
    }
    _.map(target, function(value2, key2) {
      if (value.template.catalog_id == target) {
      }
    });
  });
};

exports.getBenisonIds = function(data, column) {
  return _.map(data, function(value, key) {
    return value[column];
  });
};

exports.getUserInfoFromWeChart = function(appId, sessionKey, encryptedData, iv) {
  var pc = new WXBizDataCrypt(appId, sessionKey);

  var data = pc.decryptData(encryptedData, iv);

  return data;
};
exports.sha1 = function(message) {
  return crypto
    .createHash('sha1')
    .update(message, 'utf8')
    .digest('hex');
};
/**
 * 过滤emoji表情
 * @param  {[type]} val [description]
 * @return {[type]}     [description]
 */
exports.filteremoji = function(val) {
  let ranges = ['\ud83c[\udf00-\udfff]', '\ud83d[\udc00-\ude4f]', '\ud83d[\ude80-\udeff]'];
  let emojireg = val;
  emojireg = emojireg.replace(new RegExp(ranges.join('|'), 'g'), '');
  return emojireg;
};

exports.txtFormat = function(txt) {
  if (!txt) {
    return '';
  } else {
    const newTxt = base64url.encode(_word2.default.replaceKeywords(txt, '*'));
    return newTxt;
  }
};
