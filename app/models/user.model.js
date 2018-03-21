/*
* @Author: perry
* @Date:   2018-03-14 09:57:50
* @Last Modified by:   perry
* @Last Modified time: 2018-03-21 16:40:13
*/
const Sequelize = require('sequelize');
const db = require('../db/core.js');

const User = db.define('user', {
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