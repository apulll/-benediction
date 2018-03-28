/*
* @Author: perry
* @Date:   2018-03-14 09:57:50
* @Last Modified by:   perry
* @Last Modified time: 2018-03-28 10:00:43
*/
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
    type: Sequelize.STRING
  }
});


export default User;