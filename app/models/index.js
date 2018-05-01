/*
* @Author: perry
* @Date:   2018-03-14 15:05:01
* @Last Modified by:   perry
* @Last Modified time: 2018-04-30 22:04:53
*/
import config from '../config';
const Sequelize = require('sequelize');
const db = require('../db/core.js');
const sequelize_fixtures = require('sequelize-fixtures');
const path = require('path');
const Promise = require('bluebird');
const Logger = require('../lib/logger')('model/index');
import Benison from './benison.model';
import Catalog from './catalog.model';
import File from './file.model';
import Template from './template.model';
import User from './user.model';
import UserBenison from './user.benison.model';
import UserBenisonLike from './user.benison.like.model';

import UserGongyi from './gongyi.user.model';
import MoneyGongyi from './gongyi.money.user.model';
import seeders from '../mocks/db_init';

// UserBenison.sync({force: true})
Template.belongsTo(Catalog);
Benison.belongsTo(Template);
Benison.belongsTo(User);
Catalog.hasMany(Template);
Template.hasMany(Benison);
User.hasMany(Benison);

const model = {
  BenisonModel: Benison,
  CatalogModel: Catalog,
  TemplateModel: Template,
  UserModel: User,
  UserBenisonModel: UserBenison,
  UserBenisonLikeModel: UserBenisonLike,
  FileModel: File,

  UserGongyiModel: UserGongyi,
  MoneyGongyiModel: MoneyGongyi
};
db.sync().then(aaa => {
  Logger.info(aaa);
  sequelize_fixtures
    .loadFiles(
      [
        path.resolve(__dirname, '../seeders/users.js'),
        path.resolve(__dirname, '../seeders/catalogs.js'),
        path.resolve(__dirname, '../seeders/templates.js'),
        path.resolve(__dirname, '../seeders/benisons.js')
      ],
      model
    )
    .then(function(doStuffAfterLoad) {
      console.log(doStuffAfterLoad, 'doStuffAfterLoad');
    })
    .catch(error => {
      console.log(error);
      Logger.error(error);
    });
});

export default model;
