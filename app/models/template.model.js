/*
* @Author: perry
* @Date:   2018-03-14 09:57:50
* @Last Modified by:   perry
* @Last Modified time: 2018-03-29 15:49:10
*/
import moment from 'moment';
import config from '../config';
const Sequelize = require('sequelize');
const db = require('../db/core.js');

const Template = db.define(
  'template',
  {
    thumb: {
      type: Sequelize.STRING,
      comment: '统一的使用一个名称，上传图片是只要统一前面的这个名称'
    },
    top: {
      type: Sequelize.INTEGER(10),
      defaultValue: 0,
      comment: '文字距离顶部的坐标'
    },
    position: {
      type: Sequelize.ENUM('center', 'left', 'right'),
      defaultValue: 'center',
      comment: '文字对齐方式'
    },
    created_at: {
      type: Sequelize.DATE,
      get() {
        return moment(this.getDataValue('created_at')).format('YYYY-MM-DD HH:mm:ss');
      }
    },
    updated_at: {
      type: Sequelize.DATE,
      get() {
        return moment(this.getDataValue('updated_at')).format('YYYY-MM-DD HH:mm:ss');
      }
    }
  },
  {
    getterMethods: {
      bg_img() {
        const urlOrigin = `https://${config.QCLOUD_BUCKET}-${config.QCLOUD_APPID}${
          config.QLOUD_CDN_URL_EXTEND
        }static/images/`;
        return urlOrigin + this.thumb + '_bg_img.jpg';
      },
      bg_imgsumb() {
        const urlOrigin = `https://${config.QCLOUD_BUCKET}-${config.QCLOUD_APPID}${
          config.QLOUD_CDN_URL_EXTEND
        }static/images/`;
        return urlOrigin + this.thumb + '.png';
      },
      bg_bension_img() {
        const urlOrigin = `https://${config.QCLOUD_BUCKET}-${config.QCLOUD_APPID}${
          config.QLOUD_CDN_URL_EXTEND
        }static/images/`;
        return urlOrigin + this.thumb + '_bg_bension_img.png';
      }
    }
  }
);

export default Template;
