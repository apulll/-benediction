/*
* @Author: perry
* @Date:   2018-03-14 15:05:01
* @Last Modified by:   perry
* @Last Modified time: 2018-03-19 17:06:45
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
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  password: {
    type: Sequelize.STRING
  }
});




const User = db.define('user', {
  openid: {
    type: Sequelize.STRING,
    allowNull: false
  },
  avatar_url: {
    type: Sequelize.TEXT
  },
  nick_name: {
    type: Sequelize.STRING
  }
});


const UserBenison = db.define('user_benison', {
  user_id: {
    type: Sequelize.INTEGER,
    allowNull: false

  },
  bension_id: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  is_created: {
    type: Sequelize.INTEGER,
    comment: "是否是当前用户创建的 1 是，0 代表从其他用户处收到的祝福",
    description: "是否是当前用户创建的 1 是，0 代表从其他用户处收到的祝福"
  }
},
{
  comment: '用户-祝福语表',
  indexes: [
    {
      name: 'user_benison_index_name_1',
      method: 'BTREE',
      fields: ['user_id']
    },{
      name: 'user_benison_index_name_2',
      method: 'BTREE',
      fields: ['bension_id']
    }
  ]
}
);

UserBenison.sync({force: true})
Template.belongsTo(Catalog)
Benison.belongsTo(Template)
Benison.belongsTo(User)
Catalog.hasMany(Template)
Template.hasMany(Benison)
User.hasMany(Benison)

db.sync()


// var catalog = yield Catalog.create({'catalog_name': '朋友'});
// var template = yield Template.create({'bg_img': 'b'});
// yield catalog.addTemplate(template);

// Benison.sync({force: true}).then(() => {
//   // Table created
//   return Benison.create({
//     benisons_txt: '愿你强大到无需宠爱无需疼，却又幸运到有人宠有人疼一起走，一起笑，一起癫狂，一起怀抱',
//     liked_total: 56,
//     is_belong_template:'1',
//     template_id: 1,
//     user_id:1
//   });
// });



const model = {
	BenisonModel: Benison,
	CatalogModel: Catalog,
	TemplateModel: Template,
	UserModel: User,
  UserBenisonModel: UserBenison,
}

export default model;