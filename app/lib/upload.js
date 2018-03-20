/*
* @Author: perry
* @Date:   2018-03-20 09:38:54
* @Last Modified by:   perry
* @Last Modified time: 2018-03-20 10:17:57
*/

import config from '../config';
const fs = require('fs');
const COS = require('cos-nodejs-sdk-v5');
const multer  = require('multer');
// const upload = multer({ dest: 'tmp/' });


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'tmp/')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  }
})
 
const upload = multer({ storage: storage })


const cos = new COS({
    APPID: config.QCLOUD_APPID,
    SecretId: config.QCLOUD_SECRETID,
    SecretKey: config.QCLOUD_SECRETKEY
});
const qcloud_cos = {
    Bucket: config.QCLOUD_BUCKET,
    Region: config.QCLOUD_REGION,
}

exports.upload = upload

exports.qcloud_cos = qcloud_cos
exports.cos = cos