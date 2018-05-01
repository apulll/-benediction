/*
* @Author: perry
* @Date:   2018-03-14 10:19:45
* @Last Modified by:   perry
* @Last Modified time: 2018-05-01 10:38:40
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
