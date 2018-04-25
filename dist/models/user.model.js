'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

const base64url = require('base64-url'); /*
                                         * @Author: perry
                                         * @Date:   2018-03-14 09:57:50
                                         * @Last Modified by:   perry
                                         * @Last Modified time: 2018-04-03 14:59:13
                                         */

const urlencode = require('urlencode');
const Sequelize = require('sequelize');
const db = require('../db/core.js');

const User = db.define('user', {
  id: {
    type: Sequelize.UUID(32),
    notNull: true,
    primaryKey: true
  },
  openid: {
    type: Sequelize.STRING,
    allowNull: false
  },
  avatar_url: {
    type: Sequelize.TEXT
  },
  nick_name: {
    type: Sequelize.STRING,
    get() {
      return base64url.decode(this.getDataValue('nick_name'));
      // return this.getDataValue('nick_name');
    }
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
});

exports.default = User;
