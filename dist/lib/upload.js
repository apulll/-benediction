'use strict';

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

const fs = require('fs'); /*
                          * @Author: perry
                          * @Date:   2018-03-20 09:38:54
                          * @Last Modified by:   perry
                          * @Last Modified time: 2018-04-10 11:46:37
                          */

const COS = require('cos-nodejs-sdk-v5');
const AOSS = require('ali-oss');
const multer = require('multer');
// const upload = multer({ dest: 'tmp/' });
const Logger = require('../lib/logger')('lib/upload');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'tmp/');
  },
  filename: function(req, file, cb) {
    Logger.debug(req.body, 'req.body');
    cb(null, file.fieldname + '-' + Date.now());
  }
});

const limits = {
  fileSize: 1024 * 1024 * 2 //2 M
};

const upload = multer({ storage: storage, limits: limits });
//腾讯云
const cos = new COS({
  APPID: _config2.default.QCLOUD_APPID,
  SecretId: _config2.default.QCLOUD_SECRETID,
  SecretKey: _config2.default.QCLOUD_SECRETKEY
});

const qcloud_cos = {
  Bucket: _config2.default.QCLOUD_BUCKET,
  Region: _config2.default.QCLOUD_REGION
};

//阿里云
const ali_oss = new AOSS({
  region: _config2.default.ALI_REGION,
  accessKeyId: _config2.default.ALI_ACCESS_KEY_ID,
  accessKeySecret: _config2.default.ALI_ACCESS_KEY_SECRET
});
ali_oss.useBucket(_config2.default.ALI_BUCKET);

exports.upload = upload;

exports.qcloud_cos = qcloud_cos;
exports.cos = cos;

exports.ali_oss = ali_oss;
// exports.oss = oss;
