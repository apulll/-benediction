/*
* @Author: perry
* @Date:   2018-03-14 09:57:50
* @Last Modified by:   perry
* @Last Modified time: 2018-03-21 17:22:58
*/
import config from '../config';
const Sequelize = require('sequelize');
const db = require('../db/core.js');

const Files = db.define('file', {
  filename:{
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notNull: { args: true, msg: 'name cannot be null' }
    }
  },
  size:{
    type: Sequelize.STRING,
    allowNull: false
  },
  mimetype:{
    type: Sequelize.STRING
  }
},{
  getterMethods: {
    url() {
      const urlOrigin = `${config.QCLOUD_BUCKET}-${config.QCLOUD_APPID}${config.QLOUD_CDN_URL_EXTEND}`
      return urlOrigin + this.filename
    }
  }
})


export default Files;