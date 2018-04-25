'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

/*
* @Author: perry
* @Date:   2018-03-14 09:57:50
* @Last Modified by:   perry
* @Last Modified time: 2018-04-16 14:57:42
*/
const Sequelize = require('sequelize');
const db = require('../db/core.js');

const Template = db.define(
  'template',
  {
    thumb: {
      type: Sequelize.STRING,
      comment: '统一的使用一个名称，上传图片是只要统一前面的这个名称'
    },
    top: {
      type: Sequelize.INTEGER(10),
      defaultValue: 0,
      comment: '文字距离顶部的坐标'
    },
    position: {
      type: Sequelize.ENUM('center', 'left', 'right'),
      defaultValue: 'center',
      comment: '文字对齐方式'
    },
    created_at: {
      type: Sequelize.DATE,
      get() {
        return (0, _moment2.default)(this.getDataValue('created_at')).format('YYYY-MM-DD');
      }
    },
    updated_at: {
      type: Sequelize.DATE,
      get() {
        return (0, _moment2.default)(this.getDataValue('updated_at')).format('YYYY-MM-DD');
      }
    }
  },
  {
    getterMethods: {
      bg_img() {
        const urlOrigin = `https://${_config2.default.QCLOUD_BUCKET}-${_config2.default.QCLOUD_APPID}${
          _config2.default.QLOUD_CDN_URL_EXTEND
        }static/images/`;
        return urlOrigin + this.thumb + '_bg_img.jpg';
      },
      bg_imgsumb() {
        const urlOrigin = `https://${_config2.default.QCLOUD_BUCKET}-${_config2.default.QCLOUD_APPID}${
          _config2.default.QLOUD_CDN_URL_EXTEND
        }static/images/`;
        return urlOrigin + this.thumb + '.png';
      },
      bg_bension_img() {
        const urlOrigin = `https://${_config2.default.QCLOUD_BUCKET}-${_config2.default.QCLOUD_APPID}${
          _config2.default.QLOUD_CDN_URL_EXTEND
        }static/images/`;
        return urlOrigin + this.thumb + '_bg_bension_img.jpg';
      }
    }
  }
);

exports.default = Template;
