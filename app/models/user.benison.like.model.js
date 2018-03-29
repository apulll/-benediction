/*
* @Author: perry
* @Date:   2018-03-14 09:57:50
* @Last Modified by:   perry
* @Last Modified time: 2018-03-29 11:55:30
*/
const Sequelize = require("sequelize");
const db = require("../db/core.js");

const UserBenisonLike = db.define(
  "user_benison_like",
  {
    user_id: {
      type: Sequelize.UUID(32),
      allowNull: false
    },
    bension_id: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    is_liked_bension: {
      type: Sequelize.INTEGER(2),
      defaultValue: 0,
      comment: "是否用户对当前祝福语是喜欢的；喜欢为 1 否则为 0",
      description: "是否用户对当前祝福语是喜欢的；喜欢为 1 否则为 0"
    },
    created_at: {
      type: Sequelize.DATE,
      get() {
        return moment(this.getDataValue("created_at")).format(
          "YYYY-MM-DD HH:mm:ss"
        );
      }
    },
    updated_at: {
      type: Sequelize.DATE,
      get() {
        return moment(this.getDataValue("updated_at")).format(
          "YYYY-MM-DD HH:mm:ss"
        );
      }
    }
  },
  {
    comment: "用户-祝福语-喜欢表",
    indexes: [
      {
        name: "user_benison_like_index_name_1",
        method: "BTREE",
        fields: ["user_id"]
      },
      {
        name: "user_benison_like_index_name_2",
        method: "BTREE",
        fields: ["bension_id"]
      }
    ]
  }
);

export default UserBenisonLike;
