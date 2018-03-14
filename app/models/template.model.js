/*
* @Author: perry
* @Date:   2018-03-14 09:57:50
* @Last Modified by:   perry
* @Last Modified time: 2018-03-14 15:17:30
*/
const Sequelize = require('sequelize');
const db = require('../db/core.js');
import Benison from './benison.model';
// import Catalog from './catalog.model';

const Template = db.define('template', {
  bg_img: {
    type: Sequelize.TEXT
  },
  bg_imgsumb: {
    type: Sequelize.TEXT
  }
});

var Uke = db.define('uke', { name: Sequelize.STRING })
  , Task = db.define('task', { name: Sequelize.STRING })
  , Tool = db.define('tool', { name: Sequelize.STRING })

Task.belongsTo(Uke)
Tool.belongsTo(Task)
Uke.hasMany(Task)
Task.hasMany(Tool, { as: 'Instruments' })

db.sync()





export default Template;




