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
* @Last Modified time: 2018-03-30 23:13:22
*/
const Sequelize = require('sequelize');
const db = require('../db/core.js');

const Files = db.define(
  'file',
  {
    filename: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notNull: { args: true, msg: 'name cannot be null' }
      }
    },
    size: {
      type: Sequelize.STRING,
      allowNull: false
    },
    mimetype: {
      type: Sequelize.STRING
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
      url() {
        const urlOrigin = `${_config2.default.QCLOUD_BUCKET}-${_config2.default.QCLOUD_APPID}${
          _config2.default.QLOUD_CDN_URL_EXTEND
        }`;
        return urlOrigin + this.filename;
      }
    }
  }
);

exports.default = Files;
