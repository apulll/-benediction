/*
* @Author: perry
* @Date:   2018-03-14 09:57:50
* @Last Modified by:   perry
* @Last Modified time: 2018-03-26 15:13:53
*/
import config from '../config';
const Sequelize = require('sequelize');
const db = require('../db/core.js');

const Template = db.define('template', {
  thumb: {
    type: Sequelize.TEXT,
    comment:"统一的使用一个名称，上传图片是只要统一前面的这个名称"
  }
},{
  getterMethods: {
    bg_img() {
      const urlOrigin = `//${config.QCLOUD_BUCKET}-${config.QCLOUD_APPID}${config.QLOUD_CDN_URL_EXTEND}static/images/`
      return urlOrigin + this.thumb+'_bg_img.jpg'
    },
    bg_imgsumb() {
      const urlOrigin = `//${config.QCLOUD_BUCKET}-${config.QCLOUD_APPID}${config.QLOUD_CDN_URL_EXTEND}static/images/`
      return urlOrigin + this.thumb +'.png'
    },
    bg_bension_img() {
      const urlOrigin = `//${config.QCLOUD_BUCKET}-${config.QCLOUD_APPID}${config.QLOUD_CDN_URL_EXTEND}static/images/`
      return urlOrigin + this.thumb+ '_bg_bension_img.png'
    }
  }
});


export default Template;




