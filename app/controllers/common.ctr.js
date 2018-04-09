/*
* @Author: perry
* @Date:   2018-03-14 10:19:45
* @Last Modified by:   perry
* @Last Modified time: 2018-04-09 15:38:05
*/
import { has } from 'lodash';
import Controller from './index.js';
import model from '../models';
import { jsonFormatter, getDataFromReq, formatPage, sha1 } from '../lib';
import validatorForm from '../lib/validator';
import config from '../config';
import { cos, qcloud_cod } from '../lib/upload';
import fetch from '../lib/fetch';
import axios from 'axios';
const Promise = require('bluebird');
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const Logger = require('../lib/logger')('controllers/common');
const { check, validationResult } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');
const utf8 = require('utf8');

var cosAsync = Promise.promisifyAll(cos);

class CommonCtr extends Controller {
  constructor() {
    super();
    this.uploadQcloud = this.uploadQcloud.bind(this);
    this.upload = this.upload.bind(this);
  }
  /**
   * 图片上传
   * @param  {[type]}   req  [description]
   * @param  {[type]}   res  [description]
   * @param  {Function} next [description]
   * @return {[type]}        [description]
   */
  async upload(req, res, next) {
    try {
      const _this = this;
      const files = req.files;

      Logger.debug(req.body);
      let newFiles = [];
      const fileResults = await Promise.each(files, function(item, index, length) {
        _this.uploadQcloud(item);
      });
      const results = await model.FileModel.bulkCreate(
        fileResults,
        { fields: ['filename', 'size', 'mimetype'] },
        { validate: true }
      );
      res.status(200).send(jsonFormatter({ res: results }));
    } catch (error) {
      Logger.error(error);
      res.status(200).send(jsonFormatter({ msg: '上传文件异常' + error }, true));
    }
  }
  //上传到腾讯云
  uploadQcloud(file) {
    var params = {
      Bucket: `${config.QCLOUD_BUCKET}-${config.QCLOUD_APPID}`,
      Region: config.QCLOUD_REGION,
      Key: file.filename,
      FilePath: path.resolve(process.cwd(), file.path)
    };

    const results = cosAsync
      .sliceUploadFileAsync(params)
      .then(function(res) {
        return res;
      })
      .catch(function(error) {
        return error;
      });
    return results;
  }
  /**
   * 敏感词过滤
   * @param  {[type]}   req  [description]
   * @param  {[type]}   res  [description]
   * @param  {Function} next [description]
   * @return {[type]}        [description]
   */
  async textFilter(req, res, next) {
    const data = getDataFromReq(req);
    console.log(data, 'data ===');
    const opts = {
      data: {
        src: data.src
      }
    };
    const url = `${ALI_FILTER_URL}?src=${utf8.encode(data.src)}`;
    console.log(`APPCODE ${config.ALI_FILTER_TEXT_APPCODE}`, 'url textfilter');
    // axios.headers['Authorization'] = `APPCODE ${config.ALI_FILTER_TEXT_APPCODE}`;
    axios({
      method: 'post',
      url: url,
      headers: { Authorization: `APPCODE ${config.ALI_FILTER_TEXT_APPCODE}` }
    })
      .then(function(response) {
        res.status(200).send(jsonFormatter({ res: response.data }));
        // console.log(response, 'response');
      })
      .catch(function(error) {
        Logger.error(error);
      });
  }
  async getCodeUrl(req, res, next) {
    const opts = {
      url: 'https://api.weixin.qq.com/cgi-bin/token',
      data: {
        grant_type: 'client_credential',
        appid: config.APP_ID,
        secret: config.SECRET
      }
    };
    const newData = await fetch(opts);
    if (has(newData, 'errcode')) {
      //正式返回
      res.status(200).send(jsonFormatter({ msg: newData.errmsg }, true));
    } else {
      console.log(newData, 'newData');
      let params = { path: '/pages/detail/detail?query=1', width: 430 };
      params = JSON.stringify(params);
      const opts2 = {
        url: `https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=${newData.access_token}`,
        data: params,
        // data: {
        //  scene: '?aaa=1212',
        //  page: '/pages/detail/detail',
        //  width: 128
        // },
        method: 'post'
      };
      const url = `https://api.weixin.qq.com/wxa/getwxacode?access_token=${newData.access_token}`;
      const results = await axios.post(url, params, { responseType: 'stream' });
      results.data.pipe(fs.createWriteStream('qrcode.png'));
      console.log(results, 'results');
      // // 拼接url
      // const url = `https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=${newData.access_token}`;
      // // 发送POST请求
      // const results = await axios.post(
      //  url,
      //  {
      //    page: '/pages/detail/detail',
      //    scene: 'aaa=1212'
      //  },
      //  { responseType: 'stream' }
      // );
      // results.data.pipe(fs.createWriteStream('qrcode.png'));
      Logger.debug(results, 'response111');
    }
  }
  /**
   * 获得微信小程序二维码-无限制方案 B
   * @param  {[type]} options.page  [description]
   * @param  {[type]} options.scene [description]
   * @return {[type]}               [description]
   */
  async getWxaCodeUnlimit({ page, scene }) {
    const filename = sha1(page + scene);
    const filePath = path.join(__dirname, `./qrcode/${filename}.png`);
  }
  /**
   * 文件上传，限定只能传图片
   * @param  {[type]}   req  [description]
   * @param  {[type]}   res  [description]
   * @param  {Function} next [description]
   * @return {[type]}        [description]
   */
  // async uploadImg(req, res, next) {
  //  const _this = this;
  //  const files = req.files;
  //  Logger.debug(req.body)
  //  files.map(function(file){
  //      const response = _this.uploadQcloud(file)
  //      // if(response) return;

  //  })
  //  res.status(200).send('jsonFormatter({ res : newResults})');
  // }
}

export default new CommonCtr();
