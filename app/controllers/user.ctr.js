/*
* @Author: perry
* @Date:   2018-03-14 10:19:45
* @Last Modified by:   perry
* @Last Modified time: 2018-04-18 09:47:19
*/
import Controller from './index.js';
import model from '../models';
import {
  jsonFormatter,
  getDataFromReq,
  createAndRecieveBenisonFormat,
  getBenisonIds,
  getUserInfoFromWeChart
} from '../lib';
import fetch from '../lib/fetch';
import config from '../config';
import { has, assign } from 'lodash';
import validatorForm from '../lib/validator';
import db from '../db/core';

const urlencode = require('urlencode');
const base64url = require('base64-url');
const uuidv1 = require('uuid/v1');
const Promise = require('bluebird');
const Logger = require('../lib/logger')('controllers/user');

class UserCtl extends Controller {
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
  async getUserAll(req, res, next) {
    try {
      const results = await UserModel.findAll({ raw: true });
      res.status(200).send(jsonFormatter({ res: results }));
    } catch (error) {
      Logger.error(error);
      res.status(200).send(jsonFormatter({ msg: '获取用户信息异常' + error }, true));
    }
  }
  /**
   * 获取用户创建和接收到的祝福总数
   * @param  {[type]}   req  [description]
   * @param  {[type]}   res  [description]
   * @param  {Function} next [description]
   * @return {[type]}        [description]
   */
  async getUserCreateAndRecieveCount(req, res, next) {
    try {
      const data = getDataFromReq(req);
      const id = data.user_id; //必填
      const openid = data.openid; //必填
      const results = await model.UserModel.findOne({
        where: { id: id, openid: openid }
      });

      if (results) {
        const newResults = await model.UserBenisonModel.findAndCountAll({
          raw: true,
          where: { user_id: id, is_created: 1 }
        });
        const newResults2 = await model.UserBenisonModel.findAndCountAll({
          raw: true,
          where: { user_id: id, is_created: 0 }
        });
        const is_created_1 = assign({}, { is_created: 1, total: newResults ? newResults.count : 0 });

        const is_created_0 = assign(
          {},
          {
            is_created: 0,
            total: newResults2 ? newResults2.count : 0
          }
        );
        const lastResults = [is_created_1, is_created_0];
        res.status(200).send(jsonFormatter({ res: lastResults }));
      } else {
        res.status(200).send(jsonFormatter({ msg: '获取 用户信息失败' }, true));
      }
    } catch (error) {
      res.status(200).send(jsonFormatter({ msg: '获取用户信息异常' + error }, true));
    }
  }
  /**
   * 获取单个用户信息并且返回相关的用户所创建和接收的祝福
   * @param  {[type]}   req  [description]
   * @param  {[type]}   res  [description]
   * @param  {Function} next [description]
   * @return {[type]}        [description]
   */
  async getUserInfo(req, res, next) {
    try {
      const data = getDataFromReq(req);
      const id = data.user_id; //必填
      const openid = data.openid; //必填
      const is_created = data.is_created; //必填
      const results = await model.UserModel.findOne({
        where: { id: id, openid: openid }
      });
      const catalogs = await model.CatalogModel.findAll();
      if (results) {
        const newResults = await model.UserBenisonModel.findAll({
          attributes: ['bension_id'],
          order: [['bension_id', 'ASC']],
          where: { user_id: id, is_created: is_created }
          // include:[
          //  {
          //   association: model.BenisonModel.hasOne( model.UserBenisonModel, { foreignKey:'benison_id'})
          //  }
          // ]
        });
        const ids = getBenisonIds(JSON.parse(JSON.stringify(newResults)), 'bension_id');
        const catalogids = getBenisonIds(JSON.parse(JSON.stringify(catalogs)), 'id');
        const catalogsData = JSON.parse(JSON.stringify(catalogs));
        let newData = [];
        await Promise.each(catalogids, async function(item, index, length) {
          let newObj = assign({}, catalogsData[index], {
            benisons: []
          });
          const resben = await model.BenisonModel.findAll({
            order: [['updated_at', 'DESC']],

            where: { id: { $in: ids } },
            required: true,
            include: [
              {
                model: model.TemplateModel,
                where: { catalog_id: item },

                required: true,
                include: [
                  {
                    model: model.CatalogModel,
                    required: true
                  }
                ]
              },
              {
                model: model.UserModel,
                required: true
              }
            ]
          });
          newObj['benisons'] = resben;
          newData.push(newObj);
        });
        res.status(200).send(jsonFormatter({ res: newData }));
      } else {
        res.status(200).send(jsonFormatter({ msg: '获取 用户信息失败' }, true));
      }
    } catch (error) {
      Logger.error(error);
      res.status(200).send(jsonFormatter({ msg: '获取 用户信息异常' + error }, true));
    }
  }
  async getUserInfOld(req, res, next) {
    try {
      const data = getDataFromReq(req);
      const id = data.user_id; //必填
      const openid = data.openid; //必填
      const is_created = data.is_created; //必填
      const results = await model.UserModel.findOne({
        where: { id: id, openid: openid }
      });
      if (results) {
        const newRes = await model.UserBenisonModel.findAndCountAll({
          order: [['updated_at', 'DESC']],
          where: { user_id: id, is_created: is_created }
          // include:[
          //  {
          //   association: model.BenisonModel.hasMany( model.UserBenisonModel, { foreignKey:'benison_id'})
          //  }
          // ]
        });

        let newData = [];
        await Promise.each(newRes.rows, async function(item, index, length) {
          const resben = await model.BenisonModel.findById(item.bension_id, {
            order: [['updated_at', 'DESC']],
            required: true,
            include: [
              {
                model: model.TemplateModel,
                required: true,
                include: [
                  {
                    model: model.CatalogModel,
                    required: true
                  }
                ]
              }
            ]
          });
          newData.push(resben);
        });
        const newResults = {
          total: newRes.count || null,
          data: newData || []
        };
        createAndRecieveBenisonFormat(JSON.parse(JSON.stringify(newData)));
        res.status(200).send(jsonFormatter({ res: newResults }));
      } else {
        res.status(200).send(jsonFormatter({ msg: '获取 用户信息失败' }, true));
      }
    } catch (error) {
      console.log('获取 用户信息异常', error);
      Logger.error(error);
      res.status(200).send(jsonFormatter({ msg: '获取 用户信息异常' + error }, true));
    }
  }
  /**
   * 小程序用户成功登录，获取openid 以及本系统id
   * @param  {[type]}   req  [description]
   * @param  {[type]}   res  [description]
   * @param  {Function} next [description]
   * @return {[type]}        [description]
   */
  async onLogin(req, res, next) {
    try {
      const errors = validatorForm(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }
      let { code, user_info, iv, encryptedData } = req.query;
      let results = null;
      user_info = JSON.parse(user_info);

      const opt = {
        url: config.CODE_URL,
        data: {
          grant_type: config.GRANT_TYPE,
          appid: config.APP_ID,
          secret: config.SECRET,
          js_code: code
        }
      };
      const newData = await fetch(opt);
      if (has(newData, 'errcode')) {
        //正式返回
        res.status(200).send(jsonFormatter({ msg: newData.errmsg }, true));
      } else {
        Logger.info(newData, 'newData');
        const newUserInfo = getUserInfoFromWeChart(config.APP_ID, newData.session_key, encryptedData, iv);
        const params = {
          id: uuidv1(),
          openid: newUserInfo.openId,
          avatar_url: newUserInfo.avatarUrl,
          nick_name: base64url.encode(newUserInfo.nickName)
          // nick_name: newUserInfo.nickName
        };
        // const newUserInfo = getUserInfoFromWeChart(config.APP_ID, newData.session_key, encryptedData, iv);
        Logger.info(newUserInfo, 'newUserInfo');

        results = await model.UserModel.findOne({
          where: { openid: newUserInfo.openId }
        });
        if (!results) {
          results = await model.UserModel.create(params);
        }

        res.status(200).send(jsonFormatter({ res: results }));
      }
    } catch (error) {
      res.status(200).send(jsonFormatter({ msg: '获取openid异常' + error }, true));
      Logger.error(error);
    }
  }
}

export default new UserCtl();
