'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _index = require('./index.js');

var _index2 = _interopRequireDefault(_index);

var _models = require('../models');

var _models2 = _interopRequireDefault(_models);

var _lib = require('../lib');

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

const Logger = require('../lib/logger')(
  'controllers/catalog'
); /*
                                                                * @Author: perry
                                                                * @Date:   2018-03-14 10:19:45
                                                                * @Last Modified by:   perry
                                                                * @Last Modified time: 2018-03-28 22:38:42
                                                                */

class CatalogCtl extends _index2.default {
  constructor() {
    super();
  }
  /**
   * 获取所有分类
   * @param  {[type]}   req  [description]
   * @param  {[type]}   res  [description]
   * @param  {Function} next [description]
   * @return {[type]}        [description]
   */

  getCatalogAll(req, res, next) {
    return (0, _asyncToGenerator3.default)(function*() {
      try {
        const results = yield _models2.default.CatalogModel.findAll({ raw: true });
        res.status(200).send((0, _lib.jsonFormatter)({ res: results }));
      } catch (error) {
        Logger.error(error);
        res.status(200).send((0, _lib.jsonFormatter)({ msg: '获取列表异常' + error }, true));
      }
    })();
  }
  /**
   * 创建分类
   * @param  {[type]}   req  [description]
   * @param  {[type]}   res  [description]
   * @param  {Function} next [description]
   * @return {[type]}        [description]
   */
  createCatalog(req, res, next) {
    return (0, _asyncToGenerator3.default)(function*() {
      try {
        const data = (0, _lib.getDataFromReq)(req);
        const params = {
          catalog_name: data.catalog_name,
          catalog_icon: data.catalog_icon,
          catalog_bg: data.catalog_bg
        };
        var results = yield _models2.default.CatalogModel.create(params);

        res.status(200).send((0, _lib.jsonFormatter)({ res: results }));
      } catch (error) {
        Logger.error(error);
        res.status(200).send((0, _lib.jsonFormatter)({ msg: '写入数据异常' + error }, true));
      }
    })();
  }
}

exports.default = new CatalogCtl();
