'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _lodash = require('lodash');

var _index = require('./index.js');

var _index2 = _interopRequireDefault(_index);

var _models = require('../models');

var _models2 = _interopRequireDefault(_models);

var _lib = require('../lib');

var _validator = require('../lib/validator');

var _validator2 = _interopRequireDefault(_validator);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

var _word = require('../middlewares/word');

var _word2 = _interopRequireDefault(_word);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

/*
* @Author: perry
* @Date:   2018-03-14 10:19:45
* @Last Modified by:   perry
* @Last Modified time: 2018-04-20 23:09:48
*/
const Promise = require('bluebird');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const Logger = require('../lib/logger')('controllers/benison');
const { check, validationResult } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');
const utf8 = require('utf8');
const base64url = require('base64-url');

class BenisonCtl extends _index2.default {
  constructor() {
    super();
    this.createBenison = this.createBenison.bind(this);
    this.wordFilter = this.wordFilter.bind(this);
    this.getBenisonAll = this.getBenisonAll.bind(this);
    this.getBenisonByUserIdFromLike = this.getBenisonByUserIdFromLike.bind(this);
  }
  /**
   * 根据分类id获取所有分类下的祝福
   * @param  {[type]}   req  [description]
   * @param  {[type]}   res  [description]
   * @param  {Function} next [description]
   * @return {[type]}        [description]
   */
  getBenisonAll(req, res, next) {
    var _this = this;

    return (0, _asyncToGenerator3.default)(function*() {
      Logger.debug(_config2.default, 'config');
      try {
        const errors = (0, _validator2.default)(req);
        if (!errors.isEmpty()) {
          return res.status(422).send((0, _lib.jsonFormatter)({ msg: '用户未登录', errors: errors.array() }, true));
        }

        const data = (0, _lib.getDataFromReq)(req);
        const per_page = parseInt(data.per_page) || 10;
        const page = parseInt(data.page) || 1;
        const whereConditions = (0, _lodash.has)(data, 'password')
          ? {
              is_belong_template: data.is_belong_template ? data.is_belong_template : 0,
              status: data.status ? data.status : 1,
              password: ''
            }
          : {
              is_belong_template: data.is_belong_template ? data.is_belong_template : 0,
              status: data.status ? data.status : 1
            };
        let results = yield _models2.default.BenisonModel.findAndCountAll({
          order: [['updated_at', 'DESC']],
          limit: per_page,
          offset: per_page * (page - 1),
          // where: { is_belong_template : data.is_belong_template ? data.is_belong_template : { $ne: null } },
          where: whereConditions,
          // logging: console.log,
          benchmark: true,
          include: [
            {
              model: _models2.default.TemplateModel,
              required: true,
              include: [
                data.catalog_id !== '0'
                  ? {
                      model: _models2.default.CatalogModel,
                      required: true,
                      where: { id: data.catalog_id }
                    }
                  : { model: _models2.default.CatalogModel, required: true }
              ]
            },
            {
              model: _models2.default.UserModel,
              required: true
            }
          ]
        });
        const newResults2 = yield _this.getBenisonByUserIdFromLike(data.user_id);
        results = (0, _lib.benisonAllDataFormat)(
          JSON.parse((0, _stringify2.default)(results)),
          JSON.parse((0, _stringify2.default)(newResults2))
        );

        const newResults = (0, _lib.formatPage)(page, per_page, results);
        if (results) {
          res.status(200).send((0, _lib.jsonFormatter)({ res: newResults }));
        } else {
          res.status(200).send((0, _lib.jsonFormatter)({ msg: '获取列表失败' }, true));
        }
      } catch (error) {
        res.status(200).send((0, _lib.jsonFormatter)({ msg: '获取列表异常' + error }, true));
        Logger.error(error);
      }
    })();
  }

  /**
   * 创建祝福语
   * @param  {[type]}   req  [description]
   * @param  {[type]}   res  [description]
   * @param  {Function} next [description]
   * @return {[type]}        [description]
   */
  createBenison(req, res, next) {
    return (0, _asyncToGenerator3.default)(function*() {
      try {
        const errors = (0, _validator2.default)(req);
        if (!errors.isEmpty()) {
          return res.status(422).send((0, _lib.jsonFormatter)({ msg: '用户未登录', errors: errors.array() }, true));
          // return res.status(422).json({ errors: errors.array() });
        }

        const data = (0, _lib.getDataFromReq)(req);
        // 启动监听敏感词文件 改变 自动更新
        // var path = __dirname + '/test/word.txt'; // 敏感词文件路径
        // var time = 10 * 60 * 1000; // 监听间隔时间 默认 10 * 60 * 10000 ms (10分钟)
        // word.watch(path, time);
        const hasKeyWord = _word2.default.hasKeyword(data.benisons_txt);

        // if (hasKeyWord) {
        //   return res.status(200).send(jsonFormatter({ msg: '含有非法字符，请删除后重试' }, true));
        // }
        // if()
        const benisons_txt = (0, _lib.txtFormat)(data.benisons_txt);
        let params = {
          benisons_txt: benisons_txt,
          is_belong_template: data.is_belong_template,
          password: data.password,
          template_id: data.template_id, //必填
          user_id: data.user_id, // 必填
          status: 0 //默认为0
        };
        const bension_res = yield _models2.default.TemplateModel.findById(data.template_id);
        const user_res = yield _models2.default.UserModel.findById(data.user_id);

        if (!bension_res) {
          res.status(200).send((0, _lib.jsonFormatter)({ msg: '模板不存在' }, true));
        } else if (!user_res) {
          res.status(200).send((0, _lib.jsonFormatter)({ msg: '用户不存在' }, true));
        } else {
          const results = yield _models2.default.BenisonModel.create(params);
          if (results) {
            const user_ben_rs = yield _models2.default.UserBenisonModel.create({
              user_id: data.user_id,
              bension_id: results.id,
              is_created: 1
            });

            if (user_ben_rs) {
              res.status(200).send((0, _lib.jsonFormatter)({ res: results }));
            } else {
              res.status(200).send((0, _lib.jsonFormatter)({ msg: '创建失败，请重试' }, true));
            }
          } else {
            res.status(200).send((0, _lib.jsonFormatter)({ msg: '创建失败，请重试' }, true));
          }
        }
      } catch (error) {
        res.status(200).send((0, _lib.jsonFormatter)({ msg: '创建失败' + error }, true));
        Logger.error(error);
      }
    })();
  }
  wordFilter(txt) {
    return (0, _asyncToGenerator3.default)(function*() {
      const url = `${_config2.default.ALI_FILTER_URL}?src=${utf8.encode(txt)}`;
      console.log(`APPCODE ${_config2.default.ALI_FILTER_TEXT_APPCODE}`, 'url textfilter');
      // axios.headers['Authorization'] = `APPCODE ${config.ALI_FILTER_TEXT_APPCODE}`;

      const fetch = function(txt) {
        return (0, _axios2.default)({
          method: 'post',
          url: url,
          headers: { Authorization: `APPCODE ${_config2.default.ALI_FILTER_TEXT_APPCODE}` }
        })
          .then(function(response) {
            return response.data;
          })
          .catch(function(error) {
            return null;
            Logger.error(error);
          });
      };

      const results = yield fetch(txt);

      return results;
    })();
  }
  /**
   * 更新祝福语
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
        console.log(data.benisons_txt, (0, _lib.txtFormat)(data.benisons_txt));
        const params = {
          benisons_txt: (0, _lib.txtFormat)(data.benisons_txt),
          is_belong_template: data.is_belong_template,
          password: data.password,
          liked_total: data.liked_total,
          status: data.status,
          template_id: data.template_id, //必填
          user_id: data.user_id // 必填
        };
        const bension_res = yield _models2.default.BenisonModel.findById(id);
        const user_res = yield _models2.default.UserModel.findById(data.user_id);

        if (!bension_res) {
          res.status(200).send((0, _lib.jsonFormatter)({ msg: '祝福不存在' }, true));
        } else if (!user_res) {
          res.status(200).send((0, _lib.jsonFormatter)({ msg: '用户不存在' }, true));
        } else {
          const results = yield _models2.default.BenisonModel.update(params, {
            where: {
              id: id
            }
          });
          res.status(200).send((0, _lib.jsonFormatter)({ res: results }));
        }
        //
      } catch (error) {
        res.status(200).send((0, _lib.jsonFormatter)({ msg: '更新数据失败' + error }, true));
        Logger.error(error);
      }
    })();
  }
  /**
   * 删除祝福语
   * @param  {[type]}   req  [description]
   * @param  {[type]}   res  [description]
   * @param  {Function} next [description]
   * @return {[type]}        [description]
   */
  delete(req, res, next) {
    return (0, _asyncToGenerator3.default)(function*() {
      const { id } = req.params;
      const data = (0, _lib.getDataFromReq)(req);
      try {
        const firstRes = yield _models2.default.BenisonModel.findById(id);
        if (!firstRes) {
          res.status(200).send((0, _lib.jsonFormatter)({ msg: '数据不存在' }, true));
        } else {
          const anres = yield _models2.default.UserBenisonModel.destroy({
            where: { bension_id: id }
          });
          const results = yield _models2.default.BenisonModel.destroy({
            where: { id: id }
          });
          res.status(200).send((0, _lib.jsonFormatter)({ res: results }));
        }
      } catch (error) {
        Logger.error(error);
        res.status(200).send((0, _lib.jsonFormatter)({ msg: '删除数据异常' + error }, true));
      }
    })();
  }
  /**
   * 更新祝福语的某一小块内容
   * @param  {[type]}   req  [description]
   * @param  {[type]}   res  [description]
   * @param  {Function} next [description]
   * @return {[type]}        [description]
   */
  patch(req, res, next) {
    return (0, _asyncToGenerator3.default)(function*() {
      try {
        const data = (0, _lib.getDataFromReq)(req);
        const { id } = req.params;
        const params = {
          liked_total: data.liked_total,
          benisons_txt: data.bemisons_txt,
          is_belong_template: data.is_belong_template,
          password: data.password,
          status: data.status,
          template_id: data.template_id, //必填
          user_id: data.user_id // 必填
        };
        const bension_res = yield _models2.default.TemplateModel.findById(data.template_id);
        const user_res = yield _models2.default.UserModel.findById(data.user_id);

        if (!bension_res) {
          res.status(200).send((0, _lib.jsonFormatter)({ msg: '模板不存在' }, true));
        } else if (!user_res) {
          res.status(200).send((0, _lib.jsonFormatter)({ msg: '用户不存在' }, true));
        } else {
          const results = yield _models2.default.BenisonModel.update(params, {
            where: {
              id: id
            }
          });
          res.status(200).send((0, _lib.jsonFormatter)({ res: results }));
        }
        //
      } catch (error) {
        res.status(200).send((0, _lib.jsonFormatter)({ msg: '更新数据失败' + error }, true));
        Logger.error(error);
      }
    })();
  }
  /**
   * 用户喜欢度更新
   * @param  {[type]}   req  [description]
   * @param  {[type]}   res  [description]
   * @param  {Function} next [description]
   * @return {[type]}        [description]
   */
  putLiked(req, res, next) {
    return (0, _asyncToGenerator3.default)(function*() {
      try {
        const data = (0, _lib.getDataFromReq)(req);
        const { id } = req.params;
        const isIncrement = data.liked_total_type == 'increment' ? true : false;
        let results = null;
        let user_ben_rs = null;
        const bension_res = yield _models2.default.BenisonModel.findById(id);

        const user_res = yield _models2.default.UserModel.findById(data.user_id);
        const user_like_res = yield _models2.default.UserBenisonLikeModel.findOne({
          where: { bension_id: id, user_id: data.user_id }
        });

        if (!bension_res) {
          res.status(200).send((0, _lib.jsonFormatter)({ msg: '祝福数据不存在' }, true));
        } else if (!user_res) {
          res.status(200).send((0, _lib.jsonFormatter)({ msg: '用户不存在' }, true));
        } else {
          if (user_like_res) {
            //已经存在记录
            const is_liked_bension_val = isIncrement ? 1 : 0;
            const recieved = yield _models2.default.UserBenisonLikeModel.update(
              { is_liked_bension: is_liked_bension_val },
              {
                where: {
                  bension_id: id,
                  user_id: data.user_id
                }
              }
            );
            if (recieved && user_like_res.is_liked_bension != is_liked_bension_val) {
              //防止重复更新一条数据
              results = isIncrement
                ? yield _models2.default.BenisonModel.increment('liked_total', { where: { id: id } })
                : yield _models2.default.BenisonModel.decrement('liked_total', { where: { id: id } });
            }
          } else {
            const is_liked_bension_val = isIncrement ? 1 : 0;
            const recieved = yield _models2.default.UserBenisonLikeModel.upsert({
              is_liked_bension: is_liked_bension_val,
              bension_id: id,
              user_id: data.user_id
            });
            if (recieved) {
              results = isIncrement
                ? yield _models2.default.BenisonModel.increment('liked_total', { where: { id: id } })
                : yield _models2.default.BenisonModel.decrement('liked_total', { where: { id: id } });
            }
          }
        }

        if (results) {
          res.status(200).send((0, _lib.jsonFormatter)({ res: results }));
        } else {
          res.status(200).send((0, _lib.jsonFormatter)({ msg: '数据更新失败' }, true));
        }
      } catch (error) {
        res.status(200).send((0, _lib.jsonFormatter)({ msg: '数据更新失败' + error }, true));
        Logger.error(error);
      }
    })();
  }
  /**
   * 根据当前用户id获取到用户所有喜欢的祝福
   * @param  {[type]}   req  [description]
   * @param  {[type]}   res  [description]
   * @param  {Function} next [description]
   * @return {[type]}        [description]
   */
  getBenisonByUserIdFromLike(user_id) {
    return (0, _asyncToGenerator3.default)(function*() {
      try {
        const results = yield _models2.default.UserBenisonLikeModel.findAll({
          where: { user_id: user_id }
        });
        return results;
      } catch (error) {
        return null;
        Logger.error(error);
      }
    })();
  }
  /**
   * 祝福语详情
   * @param  {[type]}   req  [description]
   * @param  {[type]}   res  [description]
   * @param  {Function} next [description]
   * @return {[type]}        [description]
   */
  getBenisonDetail(req, res, next) {
    return (0, _asyncToGenerator3.default)(function*() {
      try {
        const data = (0, _lib.getDataFromReq)(req);
        const id = data.benison_id; //必填
        const password = data.password;
        const whereConditions = password ? { id: data.benison_id, password: password } : { id: data.benison_id };
        var results = yield _models2.default.BenisonModel.findOne({
          where: whereConditions,
          benchmark: true,
          include: [
            {
              model: _models2.default.TemplateModel,
              // where: { id: data.template_id },
              include: [
                {
                  model: _models2.default.CatalogModel
                }
              ]
            },
            {
              model: _models2.default.UserModel,
              required: true
            }
          ]
        });
        res.status(200).send((0, _lib.jsonFormatter)({ res: results }));
      } catch (error) {
        res.status(200).send((0, _lib.jsonFormatter)({ msg: '获取详情失败' + error }, true));
        Logger.error(error);
      }
    })();
  }
}

exports.default = new BenisonCtl();
