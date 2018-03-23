/*
* @Author: perry
* @Date:   2018-03-14 15:05:01
* @Last Modified by:   perry
* @Last Modified time: 2018-03-23 20:41:48
*/
import config from '../config';
const Sequelize = require('sequelize');
const db = require('../db/core.js');

import Benison from './benison.model'
import Catalog from './catalog.model'
import File from './file.model'
import Template from './template.model'
import User from './user.model'
import UserBenison from './user.benison.model'


// UserBenison.sync({force: true})
Template.belongsTo(Catalog)
Benison.belongsTo(Template)
Benison.belongsTo(User)
Catalog.hasMany(Template)
Template.hasMany(Benison)
User.hasMany(Benison)

// Benison.belongsToMany(User, {
//   through: {
//     model: UserBenison,
//     unique: false,
//     scope: {
//       taggable: 'post'
//     }
//   },
//   foreignKey: 'user_id',
//   foreignKey: 'benison_id',
//   constraints: false
// })
// User.hasMany(Benison)

db.sync()


const model = {
	BenisonModel: Benison,
	CatalogModel: Catalog,
	TemplateModel: Template,
	UserModel: User,
  UserBenisonModel: UserBenison,
  FileModel: File
}

export default model;