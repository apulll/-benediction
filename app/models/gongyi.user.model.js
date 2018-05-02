/*
* @Author: perry
* @Date:   2018-03-14 09:57:50
* @Last Modified by:   perry
* @Last Modified time: 2018-05-02 14:18:00
*/
import moment from 'moment';
const base64url = require('base64-url');
const urlencode = require('urlencode');
const Sequelize = require('sequelize');
const db = require('../db/core.js');

const UserGongyi = db.define('gongyi_user', {
  uuid: {
    type: Sequelize.UUID(32),
    notNull: true
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
  gender: {
    type: Sequelize.STRING,
    allowNull: false
  },
  country: {
    type: Sequelize.STRING,
    allowNull: false
  },
  province: {
    type: Sequelize.STRING,
    allowNull: false
  },
  city: {
    type: Sequelize.STRING,
    allowNull: false
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

export default UserGongyi;
