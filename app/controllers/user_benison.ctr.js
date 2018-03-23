/*
* @Author: perry
* @Date:   2018-03-14 10:19:45
* @Last Modified by:   perry
* @Last Modified time: 2018-03-23 11:55:36
*/

import Controller from './index.js';
import model from '../models';
import { jsonFormatter, getDataFromReq, formatPage } from '../lib';
import validatorForm from '../lib/validator';
import config from '../config';
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const Logger = require('../lib/logger')('controllers/benison');
const { check,validationResult } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');

class UserBenisonCtl extends Controller {
	constructor() {
		super();
		
	}
	/**
	 * 当用户创建一条祝福语成功时或者用户收到一条祝福语时写入数据表中
	 * @param  {[type]}   req  [description]
	 * @param  {[type]}   res  [description]
	 * @param  {Function} next [description]
	 * @return {[type]}        [description]
	 */
	async updateUserBenisonRecords(req, res, next){
		try {

			const errors = validatorForm(req);

			if (!errors.isEmpty()) {
				return res.status(200).send(jsonFormatter({ errors: errors.array()}, true))
			}



			const data = getDataFromReq(req)


			const userRes = await model.UserModel.findById(data.user_id)
			const benisonRes = await model.BenisonModel.findById(data.bension_id)
			const userBenRes = await model.UserBenisonModel.findOne({where:{user_id:data.user_id, bension_id: data.bension_id}})
			if(!userRes){
				return res.status(200).send(jsonFormatter({ msg:'用户不存在'}, true))
			}
			if(!benisonRes){
				return res.status(200).send(jsonFormatter({ msg:'祝福语不存在'}, true))
			}
			if(userBenRes){
				return res.status(200).send(jsonFormatter({ msg:'该数据已经写入，请不要重复写入'}, true))
			}
			const results = await model.UserBenisonModel.create({
				user_id: data.user_id,
				bension_id: data.bension_id,
				is_created: data.is_created
			})

			if(results){
				res.status(200).send(jsonFormatter({ res : results}));
			}else{
				res.status(200).send(jsonFormatter({ msg : '写入关系失败'}, true));
			}
		}catch(error){
			Logger.error(error)
			res.status(200).send(jsonFormatter({ msg : '写入关系异常' + error }, true));
		}
		
	}
}

export default new UserBenisonCtl()