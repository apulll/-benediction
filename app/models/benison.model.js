/*
* @Author: perry
* @Date:   2018-03-14 09:57:50
* @Last Modified by:   perry
* @Last Modified time: 2018-03-30 23:12:52
*/

import moment from 'moment';
const Sequelize = require('sequelize');
const db = require('../db/core.js');

const Benison = db.define('benison', {
  benisons_txt: {
    type: Sequelize.TEXT
  },
  liked_total: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
    COMMENT: '用户喜欢度',
    description: '用户喜欢度'
  },
  is_belong_template: {
    type: Sequelize.INTEGER(2),
    defaultValue: 0,
    comment: '是否是默认的模板祝福语',
    description: '是否是默认的模板祝福语'
  },
  password: {
    type: Sequelize.STRING,
    comment: '祝福语密码，当密码设置了时，用户查看该祝福需要输入密码',
    description: '祝福语密码，当密码设置了时，用户查看该祝福需要输入密码'
  },
  status: {
    type: Sequelize.INTEGER(2),
    defaultValue: 1
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

export default Benison;
