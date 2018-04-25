'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

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

var _upload = require('../lib/upload');

var _fetch = require('../lib/fetch');

var _fetch2 = _interopRequireDefault(_fetch);

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

const co = require('co'); /*
                          * @Author: perry
                          * @Date:   2018-03-14 10:19:45
                          * @Last Modified by:   perry
                          * @Last Modified time: 2018-04-10 15:12:34
                          */

const Promise = require('bluebird');
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const Logger = require('../lib/logger')('controllers/common');
const { check, validationResult } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');
const utf8 = require('utf8');

var cosAsync = Promise.promisifyAll(_upload.cos);
// var ossAsync = Promise.promisifyAll(ali_oss);

class CommonCtr extends _index2.default {
  constructor() {
    super();
    this.uploadQcloud = this.uploadQcloud.bind(this);
    this.uploadOss = this.uploadOss.bind(this);
    this.upload = this.upload.bind(this);
  }
  /**
   * 图片上传
   * @param  {[type]}   req  [description]
   * @param  {[type]}   res  [description]
   * @param  {Function} next [description]
   * @return {[type]}        [description]
   */
  upload(req, res, next) {
    var _this2 = this;

    return (0, _asyncToGenerator3.default)(function*() {
      try {
        const _this = _this2;
        const files = req.files;

        Logger.debug(req.body);
        let newFiles = [];
        const fileResults = yield Promise.each(
          files,
          (() => {
            var _ref = (0, _asyncToGenerator3.default)(function*(item, index, length) {
              // throw new Error(item.originlname);
              const recieve = yield _this.uploadOss(item);
              if (!recieve) {
                //如果有文件上传异常
                throw '--' + item.originalname;
              }
            });

            return function(_x, _x2, _x3) {
              return _ref.apply(this, arguments);
            };
          })()
        );
        const results = yield _models2.default.FileModel.bulkCreate(
          fileResults,
          { fields: ['filename', 'size', 'mimetype'] },
          { validate: true }
        );
        res.status(200).send((0, _lib.jsonFormatter)({ res: results }));
      } catch (error) {
        Logger.error(error);
        res.status(200).send((0, _lib.jsonFormatter)({ msg: '上传文件异常' + error }, true));
      }
    })();
  }
  //上传到腾讯云
  uploadQcloud(file) {
    var params = {
      Bucket: `${_config2.default.QCLOUD_BUCKET}-${_config2.default.QCLOUD_APPID}`,
      Region: _config2.default.QCLOUD_REGION,
      Key: file.filename,
      FilePath: path.resolve(process.cwd(), file.path)
    };

    const results = cosAsync
      .sliceUploadFileAsync(params)
      .then(function(res) {
        // 上传之后删除本地文件
        fs.unlinkSync(params.FilePath);
        return res;
      })
      .catch(function(error) {
        Logger.error(error);
        // 上传之后删除本地文件
        fs.unlinkSync(params.FilePath);
        return null;
      });
    return results;
  }
  //阿里云上传
  uploadOss(file) {
    const key = file.filename;
    const filepath = path.resolve(process.cwd(), file.path);
    // ali_oss.useBucket(config.ALI_BUCKET);
    return co(function*() {
      // client.useBucket(ali_oss.bucket);
      var result = yield _upload.ali_oss.put(key, filepath);
      // 上传之后删除本地文件
      fs.unlinkSync(filepath);
      // Promise.reject();
      return result;
    }).catch(function(error) {
      Logger.error(error);
      // 上传之后删除本地文件
      fs.unlinkSync(filepath);

      return null;
    });
  }
  /**
   * 敏感词过滤
   * @param  {[type]}   req  [description]
   * @param  {[type]}   res  [description]
   * @param  {Function} next [description]
   * @return {[type]}        [description]
   */
  textFilter(req, res, next) {
    return (0, _asyncToGenerator3.default)(function*() {
      const data = (0, _lib.getDataFromReq)(req);

      const opts = {
        data: {
          src: data.src
        }
      };
      const url = `${ALI_FILTER_URL}?src=${utf8.encode(data.src)}`;

      // axios.headers['Authorization'] = `APPCODE ${config.ALI_FILTER_TEXT_APPCODE}`;
      (0, _axios2.default)({
        method: 'post',
        url: url,
        headers: { Authorization: `APPCODE ${_config2.default.ALI_FILTER_TEXT_APPCODE}` }
      })
        .then(function(response) {
          res.status(200).send((0, _lib.jsonFormatter)({ res: response.data }));
          // (response, 'response');
        })
        .catch(function(error) {
          Logger.error(error);
        });
    })();
  }
  getCodeUrl(req, res, next) {
    return (0, _asyncToGenerator3.default)(function*() {
      const opts = {
        url: 'https://api.weixin.qq.com/cgi-bin/token',
        data: {
          grant_type: 'client_credential',
          appid: _config2.default.APP_ID,
          secret: _config2.default.SECRET
        }
      };
      const newData = yield (0, _fetch2.default)(opts);
      if ((0, _lodash.has)(newData, 'errcode')) {
        //正式返回
        res.status(200).send((0, _lib.jsonFormatter)({ msg: newData.errmsg }, true));
      } else {
        let params = { path: '/pages/detail/detail?query=2', width: 430 };
        const filename = (0, _lib.sha1)(params.path);
        const filePath = path.join(__dirname, `../../public/qrcode/${filename}.png`);
        try {
          // 检测该名字的小程序码图片文件是否已存在
          yield bluebird.promisify(fs.access)(filePath, fs.constants.R_OK);
        } catch (e) {
          const opts2 = {
            url: `https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=${newData.access_token}`,
            data: (0, _stringify2.default)(params),
            // data: {
            //  scene: '?aaa=1212',
            //  page: '/pages/detail/detail',
            //  width: 128
            // },
            method: 'post'
          };

          const url = `https://api.weixin.qq.com/wxa/getwxacode?access_token=${newData.access_token}`;
          const results = yield _axios2.default.post(url, params, { responseType: 'stream' });
          results.data.pipe(fs.createWriteStream(filePath));
        }
        res
          .status(200)
          .send(
            (0, _lib.jsonFormatter)({ res: { codeUrl: `https://smallcode.chenqingpu.cn/qrcode/${filename}.png` } })
          );
        // res.send(fs.createReadStream(filePath));

        // console.log(results, 'results');
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
      }
    })();
  }
  /**
   * 获得微信小程序二维码-无限制方案 B
   * @param  {[type]} options.page  [description]
   * @param  {[type]} options.scene [description]
   * @return {[type]}               [description]
   */
  getWxaCodeUnlimit({ page, scene }) {
    return (0, _asyncToGenerator3.default)(function*() {
      const filename = (0, _lib.sha1)(page + scene);
      const filePath = path.join(__dirname, `./qrcode/${filename}.png`);
    })();
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

exports.default = new CommonCtr();
