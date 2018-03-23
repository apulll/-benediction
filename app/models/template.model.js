/*
* @Author: perry
* @Date:   2018-03-14 09:57:50
* @Last Modified by:   perry
* @Last Modified time: 2018-03-23 13:47:49
*/
const Sequelize = require('sequelize');
const db = require('../db/core.js');

const Template = db.define('template', {
  bg_img: {
    type: Sequelize.TEXT
  },
  bg_imgsumb: {
    type: Sequelize.TEXT
  },
  bg_bension_img: {
    type: Sequelize.TEXT
  }
});





export default Template;




