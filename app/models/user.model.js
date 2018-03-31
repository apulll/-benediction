/*
* @Author: perry
* @Date:   2018-03-14 09:57:50
* @Last Modified by:   perry
* @Last Modified time: 2018-03-31 17:14:29
*/
import moment from 'moment';
const base64url = require('base64-url');
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
    }
  },
  created_at: {
    type: Sequelize.DATE,
    get() {
      return moment(this.getDataValue('created_at')).format('YYYY-MM-DD');
    }
  },
  updated_at: {
    type: Sequelize.DATE,
    get() {
      return moment(this.getDataValue('updated_at')).format('YYYY-MM-DD');
    }
  }
});

export default User;
