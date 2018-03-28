/*
* @Author: perry
* @Date:   2018-03-14 09:38:31
* @Last Modified by:   perry
* @Last Modified time: 2018-03-28 22:39:17
*/
import config from "../config";

const Logger = require("../lib/logger")("db/core");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

const operatorsAliases = {
  $eq: Op.eq,
  $ne: Op.ne,
  $gte: Op.gte,
  $gt: Op.gt,
  $lte: Op.lte,
  $lt: Op.lt,
  $not: Op.not,
  $in: Op.in,
  $notIn: Op.notIn,
  $is: Op.is,
  $like: Op.like,
  $notLike: Op.notLike,
  $iLike: Op.iLike,
  $notILike: Op.notILike,
  $regexp: Op.regexp,
  $notRegexp: Op.notRegexp,
  $iRegexp: Op.iRegexp,
  $notIRegexp: Op.notIRegexp,
  $between: Op.between,
  $notBetween: Op.notBetween,
  $overlap: Op.overlap,
  $contains: Op.contains,
  $contained: Op.contained,
  $adjacent: Op.adjacent,
  $strictLeft: Op.strictLeft,
  $strictRight: Op.strictRight,
  $noExtendRight: Op.noExtendRight,
  $noExtendLeft: Op.noExtendLeft,
  $and: Op.and,
  $or: Op.or,
  $any: Op.any,
  $all: Op.all,
  $values: Op.values,
  $col: Op.col
};

console.log(config, "config");
const sequelizeDb = new Sequelize(
  config.DB_DATABASE,
  config.DB_USER_NAME,
  config.DB_PASSWORD,
  {
    host: config.DB_HOST,
    dialect: config.DB_DIALECT,
    port: config.DB_PORT,
    operatorsAliases: operatorsAliases,
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
  }
);

sequelizeDb
  .authenticate()
  .then(() => {
    Logger.info("Connection has been established successfully.");
  })
  .catch(err => {
    Logger.error("Unable to connect to the database:", err);
  });

module.exports = sequelizeDb;
