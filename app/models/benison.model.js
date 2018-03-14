/*
* @Author: perry
* @Date:   2018-03-14 09:57:50
* @Last Modified by:   perry
* @Last Modified time: 2018-03-14 14:35:05
*/
const Sequelize = require('sequelize');
const db = require('../db/core.js');


const Benison = db.define('benison', {
  benisons_txt: {
    type: Sequelize.TEXT
  },
  liked_total: {
    type: Sequelize.INTEGER
  },
  is_belong_template: {
    type: Sequelize.STRING
  }
});

Benison.sync({force: true}).then(() => {
  // Table created
  return Benison.create({
    benisons_txt: '愿你强大到无需宠爱无需疼，却又幸运到有人宠有人疼一起走，一起笑，一起癫狂，一起怀抱',
    liked_total: 56,
    is_belong_template:'1'
  });
});




export default Benison;
