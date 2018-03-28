/*
* @Author: perry
* @Date:   2018-03-14 09:57:50
* @Last Modified by:   perry
* @Last Modified time: 2018-03-28 10:19:35
*/
const Sequelize = require('sequelize');
const db = require('../db/core.js');

const UserBenison = db.define('user_benison', {
    user_id: {
      type: Sequelize.UUID(32),
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


export default UserBenison;