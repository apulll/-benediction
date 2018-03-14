/*
* @Author: perry
* @Date:   2018-03-14 15:05:01
* @Last Modified by:   perry
* @Last Modified time: 2018-03-14 16:07:02
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

const Template = db.define('template', {
  bg_img: {
    type: Sequelize.TEXT
  },
  bg_imgsumb: {
    type: Sequelize.TEXT
  }
});

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


const User = db.define('user', {
  firstName: {
    type: Sequelize.STRING
  },
  lastName: {
    type: Sequelize.STRING
  }
});


Template.belongsTo(Catalog)
Benison.belongsTo(Template)
Catalog.hasMany(Template)
Template.hasMany(Benison)

db.sync()


// var catalog = yield Catalog.create({'catalog_name': '朋友'});
// var template = yield Template.create({'bg_img': 'b'});
// yield catalog.addTemplate(template);

// Benison.sync({force: true}).then(() => {
//   // Table created
//   return Benison.create({
//     benisons_txt: '愿你强大到无需宠爱无需疼，却又幸运到有人宠有人疼一起走，一起笑，一起癫狂，一起怀抱',
//     liked_total: 56,
//     is_belong_template:'1'
//   });
// });



const model = {
	BenisonModel: Benison,
	CatalogModel: Catalog,
	TemplateModel: Template,
	UserModel: User,
}

export default model;