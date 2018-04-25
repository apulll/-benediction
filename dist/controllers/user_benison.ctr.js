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

var _validator = require('../lib/validator');

var _validator2 = _interopRequireDefault(_validator);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

const Sequelize = require('sequelize'); /*
                                        * @Author: perry
                                        * @Date:   2018-03-14 10:19:45
                                        * @Last Modified by:   perry
                                        * @Last Modified time: 2018-04-18 09:45:26
                                        */

const Op = Sequelize.Op;
const Logger = require('../lib/logger')('controllers/benison');
const { check, validationResult } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');

class UserBenisonCtl extends _index2.default {
  constructor() {
    super();
  }

  /**
   * 当用户创建一条祝福语成功时或者用户收到一条祝福语时写入数据表中
   * @param  {[type]}   req  [description]
   * @param  {[type]}   res  [description]
   * @param  {Function} next [description]
   * @return {[type]}        [description]
   */
  updateUserBenisonRecords(req, res, next) {
    return (0, _asyncToGenerator3.default)(function*() {
      try {
        const errors = (0, _validator2.default)(req);

        if (!errors.isEmpty()) {
          return res.status(200).send((0, _lib.jsonFormatter)({ errors: errors.array() }, true));
        }

        const data = (0, _lib.getDataFromReq)(req);

        const userRes = yield _models2.default.UserModel.findById(data.user_id);
        const benisonRes = yield _models2.default.BenisonModel.findById(data.bension_id);
        const userBenRes = yield _models2.default.UserBenisonModel.findOne({
          where: { user_id: data.user_id, bension_id: data.bension_id }
        });
        if (!userRes) {
          return res.status(200).send((0, _lib.jsonFormatter)({ msg: '用户不存在' }, true));
        }
        if (!benisonRes) {
          return res.status(200).send((0, _lib.jsonFormatter)({ msg: '祝福语不存在' }, true));
        }
        if (userBenRes) {
          return res.status(200).send((0, _lib.jsonFormatter)({ msg: '该数据已经写入，请不要重复写入' }, true));
        }
        const results = yield _models2.default.UserBenisonModel.create({
          user_id: data.user_id,
          bension_id: data.bension_id,
          is_created: data.is_created
        });
        if (results) {
          res.status(200).send((0, _lib.jsonFormatter)({ res: results }));
        } else {
          res.status(200).send((0, _lib.jsonFormatter)({ msg: '写入关系失败' }, true));
        }
      } catch (error) {
        Logger.error(error);
        res.status(200).send((0, _lib.jsonFormatter)({ msg: '写入关系异常' + error }, true));
      }
    })();
  }
}

exports.default = new UserBenisonCtl();
