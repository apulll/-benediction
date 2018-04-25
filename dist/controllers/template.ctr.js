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
  'controllers/template'
); /*
                                                                 * @Author: perry
                                                                 * @Date:   2018-03-14 10:19:45
                                                                 * @Last Modified by:   perry
                                                                 * @Last Modified time: 2018-04-18 09:47:01
                                                                 */

class TemplateCtl extends _index2.default {
  constructor() {
    super();
  }
  /**
   * 获取所有模板
   * @param  {[type]}   req  [description]
   * @param  {[type]}   res  [description]
   * @param  {Function} next [description]
   * @return {[type]}        [description]
   */
  getTemplateAll(req, res, next) {
    return (0, _asyncToGenerator3.default)(function*() {
      try {
        const results = yield _models2.default.TemplateModel.findAll({ raw: true });
        res.status(200).send((0, _lib.jsonFormatter)({ res: results }));
      } catch (error) {
        Logger.error(error);
        res.status(200).send((0, _lib.jsonFormatter)({ msg: '获取列表异常' + error }, true));
      }
    })();
  }

  /**
   * 创建模板
   * @param  {[type]}   req  [description]
   * @param  {[type]}   res  [description]
   * @param  {Function} next [description]
   * @return {[type]}        [description]
   */
  createTemplate(req, res, next) {
    return (0, _asyncToGenerator3.default)(function*() {
      try {
        const data = (0, _lib.getDataFromReq)(req);
        const params = {
          catalog_id: data.catalog_id,
          bg_img: data.bg_img,
          bg_imgsumb: data.bg_imgsumb
        };

        var results = yield _models2.default.TemplateModel.create(params);

        res.status(200).send((0, _lib.jsonFormatter)({ res: results }));
      } catch (error) {
        Logger.error(error);
        res.status(200).send((0, _lib.jsonFormatter)({ msg: '写入数据异常' + error }, true));
      }
    })();
  }
  create(req, res, next) {
    return (0, _asyncToGenerator3.default)(function*() {
      try {
      } catch (error) {}
    })();
  }
  /**
   * 更新模板
   * @param  {[type]}   req  [description]
   * @param  {[type]}   res  [description]
   * @param  {Function} next [description]
   * @return {[type]}        [description]
   */
  update(req, res, next) {
    return (0, _asyncToGenerator3.default)(function*() {
      try {
        const data = (0, _lib.getDataFromReq)(req);
        const { id } = req.params;
        const params = {
          catalog_id: data.catalog_id,
          bg_img: data.bg_img,
          bg_imgsumb: data.bg_imgsumb
        };
        const catResults = yield _models2.default.CatalogModel.findById(id);
        if (catResults) {
          var results = yield _models2.default.TemplateModel.update(params, {
            where: {
              id: 15
            }
          });
        } else {
          res.status(200).send((0, _lib.jsonFormatter)({ msg: '分类不存在，请先创建分类' }, true));
        }
        res.status(200).send((0, _lib.jsonFormatter)({ res: results }));
      } catch (error) {
        Logger.error(error);
        res.status(200).send((0, _lib.jsonFormatter)({ msg: '更新数据异常' + error }, true));
      }
    })();
  }
}

exports.default = new TemplateCtl();
