/*
* @Author: perry
* @Date:   2018-03-14 09:57:50
* @Last Modified by:   perry
* @Last Modified time: 2018-03-14 14:56:07
*/
const Sequelize = require('sequelize');
const db = require('../db/core.js');
import Template from './template.model';

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

// Catalog.sync()

Catalog.hasMany(Template);

Template.belongsTo(Catalog);

Catalog.sync()
Template.sync()

export default Catalog;


