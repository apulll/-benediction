'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

var _benison = require('./benison.model');

var _benison2 = _interopRequireDefault(_benison);

var _catalog = require('./catalog.model');

var _catalog2 = _interopRequireDefault(_catalog);

var _file = require('./file.model');

var _file2 = _interopRequireDefault(_file);

var _template = require('./template.model');

var _template2 = _interopRequireDefault(_template);

var _user = require('./user.model');

var _user2 = _interopRequireDefault(_user);

var _userBenison = require('./user.benison.model');

var _userBenison2 = _interopRequireDefault(_userBenison);

var _userBenisonLike = require('./user.benison.like.model');

var _userBenisonLike2 = _interopRequireDefault(_userBenisonLike);

var _db_init = require('../mocks/db_init');

var _db_init2 = _interopRequireDefault(_db_init);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

const Sequelize = require('sequelize'); /*
                                        * @Author: perry
                                        * @Date:   2018-03-14 15:05:01
                                        * @Last Modified by:   perry
                                        * @Last Modified time: 2018-04-18 09:57:43
                                        */

const db = require('../db/core.js');
const sequelize_fixtures = require('sequelize-fixtures');
const path = require('path');
const Promise = require('bluebird');
const Logger = require('../lib/logger')('model/index');

// UserBenison.sync({force: true})
_template2.default.belongsTo(_catalog2.default);
_benison2.default.belongsTo(_template2.default);
_benison2.default.belongsTo(_user2.default);
_catalog2.default.hasMany(_template2.default);
_template2.default.hasMany(_benison2.default);
_user2.default.hasMany(_benison2.default);

const model = {
  BenisonModel: _benison2.default,
  CatalogModel: _catalog2.default,
  TemplateModel: _template2.default,
  UserModel: _user2.default,
  UserBenisonModel: _userBenison2.default,
  UserBenisonLikeModel: _userBenisonLike2.default,
  FileModel: _file2.default
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

exports.default = model;
