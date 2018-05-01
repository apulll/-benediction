/*
* @Author: perry
* @Date:   2018-03-14 09:57:50
* @Last Modified by:   perry
* @Last Modified time: 2018-04-30 22:19:56
*/
import moment from 'moment';
const base64url = require('base64-url');
const urlencode = require('urlencode');
const Sequelize = require('sequelize');
const db = require('../db/core.js');

const MoneyGongyi = db.define('gongyi_money', {
  user_id: {
    type: Sequelize.UUID(32),
    notNull: true
  },
  money: {
    type: Sequelize.FLOAT(),
    allowNull: false
  }
});

export default MoneyGongyi;
