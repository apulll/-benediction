/*
* @Author: perry
* @Date:   2018-03-14 15:05:01
* @Last Modified by:   perry
* @Last Modified time: 2018-03-28 10:38:38
*/
import config from '../config';
const Sequelize = require('sequelize');
const db = require('../db/core.js');
const sequelize_fixtures = require('sequelize-fixtures');
const path = require('path');
const Promise = require("bluebird");
const Logger = require('../lib/logger')('model/index');
import Benison from './benison.model'
import Catalog from './catalog.model'
import File from './file.model'
import Template from './template.model'
import User from './user.model'
import UserBenison from './user.benison.model'
import UserBenisonLike from './user.benison.like.model'
import seeders from '../mocks/db_init'

// UserBenison.sync({force: true})
Template.belongsTo(Catalog)
Benison.belongsTo(Template)
Benison.belongsTo(User)
Catalog.hasMany(Template)
Template.hasMany(Benison)
User.hasMany(Benison)



const model = { 
	BenisonModel: Benison,
	CatalogModel: Catalog,
	TemplateModel: Template,
	UserModel: User,
  UserBenisonModel: UserBenison,
  UserBenisonLikeModel: UserBenisonLike,
  FileModel: File
}
db.sync().then((aaa)=>{
	Logger.info(aaa)
	sequelize_fixtures.loadFiles([path.resolve(__dirname, '../seeders/users.js'), path.resolve(__dirname, '../seeders/catalogs.js'), path.resolve(__dirname, '../seeders/templates.js'), path.resolve(__dirname, '../seeders/benisons.js')], model).then(function(doStuffAfterLoad){
	    console.log(doStuffAfterLoad,'doStuffAfterLoad')
	});
})







export default model;