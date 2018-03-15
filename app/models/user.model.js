/*
* @Author: perry
* @Date:   2018-03-14 09:57:50
* @Last Modified by:   perry
* @Last Modified time: 2018-03-15 17:51:58
*/
const Sequelize = require('sequelize');
const db = require('../db/core.js');

const User = db.define('user', {
  openid: {
    type: Sequelize.STRING
  },
  avatarUrl: {
    type: Sequelize.TXT
  },
  nickName: {
    type: Sequelize.STRING
  }
});

User.sync({force: true})


export default User;