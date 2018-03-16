/*
* @Author: perry
* @Date:   2018-03-14 09:38:31
* @Last Modified by:   perry
* @Last Modified time: 2018-03-16 14:58:31
*/
const Logger = require('../lib/logger')('db/core')
const Sequelize = require('sequelize');
const sequelizeDb = new Sequelize('test', 'root', 'root', {
  host: 'localhost',
  dialect: 'mysql',
  port: 3306,
  operatorsAliases: false,
  define: {
	// 字段以下划线（_）来分割（默认是驼峰命名风格）
	 underscored: true
  },
  logging: function(sql) { 
        Logger.info(sql);  
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

sequelizeDb
  .authenticate()
  .then(() => {
    Logger.info('Connection has been established successfully.');
  })
  .catch(err => {
    Logger.error('Unable to connect to the database:', err)
  });



module.exports = sequelizeDb;