/*
* @Author: perry
* @Date:   2018-03-14 10:19:45
* @Last Modified by:   perry
* @Last Modified time: 2018-05-02 15:06:52
*/
import Controller from './index.js';
import model from '../models';
import {
  jsonFormatter,
  getDataFromReq,
  createAndRecieveBenisonFormat,
  getBenisonIds,
  getUserInfoFromWeChart,
  getTotalMoney
} from '../lib';
import fetch from '../lib/fetch';
import config from '../config';
import { has, assign, map } from 'lodash';
import validatorForm from '../lib/validator';
import db from '../db/core';

const urlencode = require('urlencode');
const base64url = require('base64-url');
const uuidv1 = require('uuid/v1');
const Promise = require('bluebird');
const Logger = require('../lib/logger')('controllers/user');

class UserGongyiCtl extends Controller {
  constructor() {
    super();
  }

  /**
   * 小程序用户成功登录，获取openid 以及本系统id
   * @param  {[type]}   req  [description]
   * @param  {[type]}   res  [description]
   * @param  {Function} next [description]
   * @return {[type]}        [description]
   */
  async getOpenId(req, res, next) {
    try {
      const errors = validatorForm(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }
      let { code, iv, encryptedData } = req.query;
      let results = null;
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
        console.log(newUserInfo, 'newuserIfon');
        const params = {
          uuid: uuidv1(),
          openid: newUserInfo.openId,
          avatar_url: newUserInfo.avatarUrl,
          nick_name: base64url.encode(newUserInfo.nickName),
          gender: newUserInfo.gender,
          country: newUserInfo.country,
          province: newUserInfo.province,
          city: newUserInfo.city

          // nick_name: newUserInfo.nickName
        };
        // const newUserInfo = getUserInfoFromWeChart(config.APP_ID, newData.session_key, encryptedData, iv);
        Logger.info(newUserInfo, 'newUserInfo');

        results = await model.UserGongyiModel.findOne({
          where: { openid: newUserInfo.openId }
        });
        if (!results) {
          results = await model.UserGongyiModel.create(params);
        }

        res.status(200).send(jsonFormatter({ res: results }));
      }
    } catch (error) {
      res.status(200).send(jsonFormatter({ msg: '获取openid异常' + error }, true));
      Logger.error(error);
    }
  }
  /**
   * 捐款
   * @param  {[type]}   req  [description]
   * @param  {[type]}   res  [description]
   * @param  {Function} next [description]
   * @return {[type]}        [description]
   */
  async postDonation(req, res, next) {
    try {
      const errors = validatorForm(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }
      const data = getDataFromReq(req);
      const results = await model.UserGongyiModel.findOne({
        where: { uuid: data.uuid }
      });
      if (!results) return res.status(200).send(jsonFormatter({ msg: '用户不存在,数据写入异常' }, true));
      const params = {
        user_uuid: data.uuid,
        money: data.money
        // nick_name: newUserInfo.nickName
      };
      const newResults = await model.MoneyGongyiModel.create(params);
      if (newResults) {
        res.status(200).send(jsonFormatter({ res: newResults }));
      } else {
        res.status(200).send(jsonFormatter({ msg: '捐款数据写入异常' }, true));
      }
    } catch (error) {
      res.status(200).send(jsonFormatter({ msg: '捐款数据写入异常' + error }, true));
      Logger.error(error);
    }
  }
  /**
   * 获取总捐款数据
   * 捐款数 、捐款总额
   * @param  {[type]}   req  [description]
   * @param  {[type]}   res  [description]
   * @param  {Function} next [description]
   * @return {[type]}        [description]
   */
  async getDonationInfo(req, res, next) {
    try {
      const errors = validatorForm(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }
      const data = getDataFromReq(req);
      const results = await model.UserGongyiModel.findOne({
        where: { uuid: data.uuid }
      });
      if (!results) return res.status(200).send(jsonFormatter({ msg: '用户不存在' }, true));
      const params = {
        user_uuid: data.uuid,
        money: data.money
        // nick_name: newUserInfo.nickName
      };
      const newResults = await model.MoneyGongyiModel.findAndCountAll();
      const total_money = getTotalMoney(newResults.rows);
      const total_number = newResults.count;
      const sendResult = { total_money, total_number };
      if (newResults) {
        res.status(200).send(jsonFormatter({ res: sendResult }));
      } else {
        res.status(200).send(jsonFormatter({ msg: '捐款数据获取异常' }, true));
      }
    } catch (error) {
      res.status(200).send(jsonFormatter({ msg: '获取捐款数据异常' + error }, true));
      Logger.error(error);
    }
  }
  /**
   * 获取个人捐款信息
   * @param  {[type]}   req  [description]
   * @param  {[type]}   res  [description]
   * @param  {Function} next [description]
   * @return {[type]}        [description]
   */
  async getUserInfoAndDonation(req, res, next) {
    try {
      const errors = validatorForm(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }
      const data = getDataFromReq(req);
      const results = await model.UserGongyiModel.findOne({
        where: { uuid: data.uuid }
      });
      if (!results) return res.status(200).send(jsonFormatter({ msg: '用户不存在' }, true));
      const params = {
        user_uuid: data.uuid
      };
      const newResults = await model.MoneyGongyiModel.findAll({ where: { user_uuid: data.uuid } });
      const userInfo = await model.UserGongyiModel.findOne({ where: { uuid: data.uuid } });
      const person_total_money = getTotalMoney(newResults);
      const sendResult = {
        person_total_money,
        userInfo
      };
      if (newResults) {
        res.status(200).send(jsonFormatter({ res: sendResult }));
      } else {
        res.status(200).send(jsonFormatter({ msg: '捐款数据获取异常' }, true));
      }
    } catch (error) {
      res.status(200).send(jsonFormatter({ msg: '获取捐款数据异常' + error }, true));
      Logger.error(error);
    }
  }
  async exportInfo(req, res, next) {
    const data = getDataFromReq(req);
    try {
      var include = [
        {
          association: model.UserGongyiModel.hasMany(model.MoneyGongyiModel, { foreignKey: 'user_uuid' }),
          where: { user_uuid: data.uuid }
        }
      ];

      const results = await model.UserGongyiModel.findAll({ include: include });
      if (results) {
        res.status(200).send(jsonFormatter({ res: results }));
      } else {
        res.status(200).send(jsonFormatter({ msg: '导出异常' }, true));
      }
    } catch (error) {
      res.status(200).send(jsonFormatter({ msg: '导出异常' + error }, true));
      Logger.error(error);
    }
  }
}

export default new UserGongyiCtl();
