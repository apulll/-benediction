/*
* @Author: perry
* @Date:   2018-03-14 09:57:50
* @Last Modified by:   perry
* @Last Modified time: 2018-03-23 21:00:02
*/
import config from '../config';
const Sequelize = require('sequelize');
const db = require('../db/core.js');

const Template = db.define('template', {
  thumb: {
    type: Sequelize.TEXT
  }
},{
  getterMethods: {
    bg_img() {
      const urlOrigin = `https://${config.QCLOUD_BUCKET}-${config.QCLOUD_APPID}${config.QLOUD_CDN_URL_EXTEND}static/images/`
      return urlOrigin + this.thumb+'_bg_img.jpg'
    },
    bg_imgsumb() {
      const urlOrigin = `https://${config.QCLOUD_BUCKET}-${config.QCLOUD_APPID}${config.QLOUD_CDN_URL_EXTEND}static/images/`
      return urlOrigin + this.thumb +'.png'
    },
    bg_bension_img() {
      const urlOrigin = `https://${config.QCLOUD_BUCKET}-${config.QCLOUD_APPID}${config.QLOUD_CDN_URL_EXTEND}static/images/`
      return urlOrigin + this.thumb+ '_bg_bension_img.png'
    }
  }
});


export default Template;




