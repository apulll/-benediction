/*
* @Author: perry
* @Date:   2018-03-14 09:57:50
* @Last Modified by:   perry
* @Last Modified time: 2018-03-21 16:39:30
*/
const Sequelize = require('sequelize');
const db = require('../db/core.js');



const Catalog = db.define('catalog', {
  catalog_name: {
    type: Sequelize.TEXT
  },
  catalog_icon: {
    type: Sequelize.TEXT
  },
  catalog_bg: {
    type: Sequelize.TEXT
  }
});

export default Catalog;


