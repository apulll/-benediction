'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _index = require('./index.js');

var _index2 = _interopRequireDefault(_index);

var _models = require('../models');

var _models2 = _interopRequireDefault(_models);

var _lib = require('../lib');

var _fetch = require('../lib/fetch');

var _fetch2 = _interopRequireDefault(_fetch);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

var _lodash = require('lodash');

var _validator = require('../lib/validator');

var _validator2 = _interopRequireDefault(_validator);

var _core = require('../db/core');

var _core2 = _interopRequireDefault(_core);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

/*
* @Author: perry
* @Date:   2018-03-14 10:19:45
* @Last Modified by:   perry
* @Last Modified time: 2018-04-18 09:47:19
*/
const urlencode = require('urlencode');
const base64url = require('base64-url');
const uuidv1 = require('uuid/v1');
const Promise = require('bluebird');
const Logger = require('../lib/logger')('controllers/user');

class UserCtl extends _index2.default {
  constructor() {
    super();
  }

  /**
   * 获取所有用户信息
   * @param  {[type]}   req  [description]
   * @param  {[type]}   res  [description]
   * @param  {Function} next [description]
   * @return {[type]}        [description]
   */
  getUserAll(req, res, next) {
    return (0, _asyncToGenerator3.default)(function*() {
      try {
        const results = yield UserModel.findAll({ raw: true });
        res.status(200).send((0, _lib.jsonFormatter)({ res: results }));
      } catch (error) {
        Logger.error(error);
        res.status(200).send((0, _lib.jsonFormatter)({ msg: '获取用户信息异常' + error }, true));
      }
    })();
  }
  /**
   * 获取用户创建和接收到的祝福总数
   * @param  {[type]}   req  [description]
   * @param  {[type]}   res  [description]
   * @param  {Function} next [description]
   * @return {[type]}        [description]
   */
  getUserCreateAndRecieveCount(req, res, next) {
    return (0, _asyncToGenerator3.default)(function*() {
      try {
        const data = (0, _lib.getDataFromReq)(req);
        const id = data.user_id; //必填
        const openid = data.openid; //必填
        const results = yield _models2.default.UserModel.findOne({
          where: { id: id, openid: openid }
        });

        if (results) {
          const newResults = yield _models2.default.UserBenisonModel.findAndCountAll({
            raw: true,
            where: { user_id: id, is_created: 1 }
          });
          const newResults2 = yield _models2.default.UserBenisonModel.findAndCountAll({
            raw: true,
            where: { user_id: id, is_created: 0 }
          });
          const is_created_1 = (0, _lodash.assign)({}, { is_created: 1, total: newResults ? newResults.count : 0 });

          const is_created_0 = (0, _lodash.assign)(
            {},
            {
              is_created: 0,
              total: newResults2 ? newResults2.count : 0
            }
          );
          const lastResults = [is_created_1, is_created_0];
          res.status(200).send((0, _lib.jsonFormatter)({ res: lastResults }));
        } else {
          res.status(200).send((0, _lib.jsonFormatter)({ msg: '获取 用户信息失败' }, true));
        }
      } catch (error) {
        res.status(200).send((0, _lib.jsonFormatter)({ msg: '获取用户信息异常' + error }, true));
      }
    })();
  }
  /**
   * 获取单个用户信息并且返回相关的用户所创建和接收的祝福
   * @param  {[type]}   req  [description]
   * @param  {[type]}   res  [description]
   * @param  {Function} next [description]
   * @return {[type]}        [description]
   */
  getUserInfo(req, res, next) {
    return (0, _asyncToGenerator3.default)(function*() {
      try {
        const data = (0, _lib.getDataFromReq)(req);
        const id = data.user_id; //必填
        const openid = data.openid; //必填
        const is_created = data.is_created; //必填
        const results = yield _models2.default.UserModel.findOne({
          where: { id: id, openid: openid }
        });
        const catalogs = yield _models2.default.CatalogModel.findAll();
        if (results) {
          const newResults = yield _models2.default.UserBenisonModel.findAll({
            attributes: ['bension_id'],
            order: [['bension_id', 'ASC']],
            where: {
              user_id: id,
              is_created: is_created
              // include:[
              //  {
              //   association: model.BenisonModel.hasOne( model.UserBenisonModel, { foreignKey:'benison_id'})
              //  }
              // ]
            }
          });
          const ids = (0, _lib.getBenisonIds)(JSON.parse((0, _stringify2.default)(newResults)), 'bension_id');
          const catalogids = (0, _lib.getBenisonIds)(JSON.parse((0, _stringify2.default)(catalogs)), 'id');
          const catalogsData = JSON.parse((0, _stringify2.default)(catalogs));
          let newData = [];
          yield Promise.each(
            catalogids,
            (() => {
              var _ref = (0, _asyncToGenerator3.default)(function*(item, index, length) {
                let newObj = (0, _lodash.assign)({}, catalogsData[index], {
                  benisons: []
                });
                const resben = yield _models2.default.BenisonModel.findAll({
                  order: [['updated_at', 'DESC']],

                  where: { id: { $in: ids } },
                  required: true,
                  include: [
                    {
                      model: _models2.default.TemplateModel,
                      where: { catalog_id: item },

                      required: true,
                      include: [
                        {
                          model: _models2.default.CatalogModel,
                          required: true
                        }
                      ]
                    },
                    {
                      model: _models2.default.UserModel,
                      required: true
                    }
                  ]
                });
                newObj['benisons'] = resben;
                newData.push(newObj);
              });

              return function(_x, _x2, _x3) {
                return _ref.apply(this, arguments);
              };
            })()
          );
          res.status(200).send((0, _lib.jsonFormatter)({ res: newData }));
        } else {
          res.status(200).send((0, _lib.jsonFormatter)({ msg: '获取 用户信息失败' }, true));
        }
      } catch (error) {
        Logger.error(error);
        res.status(200).send((0, _lib.jsonFormatter)({ msg: '获取 用户信息异常' + error }, true));
      }
    })();
  }
  getUserInfOld(req, res, next) {
    return (0, _asyncToGenerator3.default)(function*() {
      try {
        const data = (0, _lib.getDataFromReq)(req);
        const id = data.user_id; //必填
        const openid = data.openid; //必填
        const is_created = data.is_created; //必填
        const results = yield _models2.default.UserModel.findOne({
          where: { id: id, openid: openid }
        });
        if (results) {
          const newRes = yield _models2.default.UserBenisonModel.findAndCountAll({
            order: [['updated_at', 'DESC']],
            where: {
              user_id: id,
              is_created: is_created
              // include:[
              //  {
              //   association: model.BenisonModel.hasMany( model.UserBenisonModel, { foreignKey:'benison_id'})
              //  }
              // ]
            }
          });

          let newData = [];
          yield Promise.each(
            newRes.rows,
            (() => {
              var _ref2 = (0, _asyncToGenerator3.default)(function*(item, index, length) {
                const resben = yield _models2.default.BenisonModel.findById(item.bension_id, {
                  order: [['updated_at', 'DESC']],
                  required: true,
                  include: [
                    {
                      model: _models2.default.TemplateModel,
                      required: true,
                      include: [
                        {
                          model: _models2.default.CatalogModel,
                          required: true
                        }
                      ]
                    }
                  ]
                });
                newData.push(resben);
              });

              return function(_x4, _x5, _x6) {
                return _ref2.apply(this, arguments);
              };
            })()
          );
          const newResults = {
            total: newRes.count || null,
            data: newData || []
          };
          (0, _lib.createAndRecieveBenisonFormat)(JSON.parse((0, _stringify2.default)(newData)));
          res.status(200).send((0, _lib.jsonFormatter)({ res: newResults }));
        } else {
          res.status(200).send((0, _lib.jsonFormatter)({ msg: '获取 用户信息失败' }, true));
        }
      } catch (error) {
        console.log('获取 用户信息异常', error);
        Logger.error(error);
        res.status(200).send((0, _lib.jsonFormatter)({ msg: '获取 用户信息异常' + error }, true));
      }
    })();
  }
  /**
   * 小程序用户成功登录，获取openid 以及本系统id
   * @param  {[type]}   req  [description]
   * @param  {[type]}   res  [description]
   * @param  {Function} next [description]
   * @return {[type]}        [description]
   */
  onLogin(req, res, next) {
    return (0, _asyncToGenerator3.default)(function*() {
      try {
        const errors = (0, _validator2.default)(req);
        if (!errors.isEmpty()) {
          return res.status(422).json({ errors: errors.array() });
        }
        let { code, user_info, iv, encryptedData } = req.query;
        let results = null;
        user_info = JSON.parse(user_info);

        const opt = {
          url: _config2.default.CODE_URL,
          data: {
            grant_type: _config2.default.GRANT_TYPE,
            appid: _config2.default.APP_ID,
            secret: _config2.default.SECRET,
            js_code: code
          }
        };
        const newData = yield (0, _fetch2.default)(opt);
        if ((0, _lodash.has)(newData, 'errcode')) {
          //正式返回
          res.status(200).send((0, _lib.jsonFormatter)({ msg: newData.errmsg }, true));
        } else {
          Logger.info(newData, 'newData');
          const newUserInfo = (0, _lib.getUserInfoFromWeChart)(
            _config2.default.APP_ID,
            newData.session_key,
            encryptedData,
            iv
          );
          const params = {
            id: uuidv1(),
            openid: newUserInfo.openId,
            avatar_url: newUserInfo.avatarUrl,
            nick_name: base64url.encode(newUserInfo.nickName)
            // nick_name: newUserInfo.nickName
          };
          // const newUserInfo = getUserInfoFromWeChart(config.APP_ID, newData.session_key, encryptedData, iv);
          Logger.info(newUserInfo, 'newUserInfo');

          results = yield _models2.default.UserModel.findOne({
            where: { openid: newUserInfo.openId }
          });
          if (!results) {
            results = yield _models2.default.UserModel.create(params);
          }

          res.status(200).send((0, _lib.jsonFormatter)({ res: results }));
        }
      } catch (error) {
        res.status(200).send((0, _lib.jsonFormatter)({ msg: '获取openid异常' + error }, true));
        Logger.error(error);
      }
    })();
  }
}

exports.default = new UserCtl();
