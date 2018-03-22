/*
* @Author: perry
* @Date:   2018-03-14 10:19:45
* @Last Modified by:   perry
* @Last Modified time: 2018-03-22 17:05:26
*/
import Controller from './index.js';
import model from '../models';
import { jsonFormatter, getDataFromReq } from '../lib';
import fetch from '../lib/fetch';
import config from '../config';
import { has } from 'lodash';
import validatorForm from '../lib/validator';

const Promise = require("bluebird");
const Logger = require('../lib/logger')('controllers/user');

class UserCtl extends Controller {
	constructor() {
		super();
		
	}
	/**
	 * 获取所有用户信息
	 * @param  {[type]}   req  [description]
	 * @param  {[type]}   res  [description]
	 * @param  {Function} next [description]
	 * @return {[type]}        [description]
	 */
	async getUserAll(req, res, next) {
		try{
			const results = await UserModel.findAll({ raw: true});
			res.status(200).send(jsonFormatter({ res : results}));
		}catch(error){
			Logger.error(error)
			res.status(200).send(jsonFormatter({ msg : '获取用户信息异常' + error }, true));
		}
		
	}
	/**
	 * 获取单个用户信息并且返回相关的用户所创建和接收的祝福
	 * @param  {[type]}   req  [description]
	 * @param  {[type]}   res  [description]
	 * @param  {Function} next [description]
	 * @return {[type]}        [description]
	 */
	async getUserInfo(req, res, next) {
		try{
			const data = getDataFromReq(req)
			const id = data.user_id //必填
			const openid = data.openid //必填
			const is_created = data.is_created //必填
			const results = await model.UserModel.findOne({where:{id:id, openid:openid}})
			if(results){
				const newRes = await model.UserBenisonModel.findAndCountAll({
								order: [['updated_at', 'DESC']],
								where: { user_id: id, is_created:is_created },
								// include:[
								// 	{
								// 	 association: model.BenisonModel.hasMany( model.UserBenisonModel, { foreignKey:'benison_id'})
								// 	}
								// ]
							})

				let newData = []
				await Promise.each(newRes.rows, async function(item, index, length){
					 const resben = await model.BenisonModel.findById(item.bension_id, {
														order: [['updated_at', 'DESC']],
														required: true,
														include: [{
															model: model.TemplateModel,
															required: true,
															include:[
															 { model:model.CatalogModel, required: true}
															]
														}

														]
													})
					 newData.push(resben)
				})
				const newResults = {
					total: newRes.count || null,
					data: newData || []
				}
				res.status(200).send(jsonFormatter({ res : newResults }));
			}else{
				res.status(200).send(jsonFormatter({ msg : "获取 用户信息失败" }, true));
			}
		}catch(error){
			Logger.error(error)
			res.status(200).send(jsonFormatter({ msg : "获取 用户信息异常"+error }, true));
		}
		
	}
	/**
	 * 小程序用户成功登录，获取openid 以及本系统id
	 * @param  {[type]}   req  [description]
	 * @param  {[type]}   res  [description]
	 * @param  {Function} next [description]
	 * @return {[type]}        [description]
	 */
	async onLogin(req, res, next) {
		try {

			const errors = validatorForm(req);
			if (!errors.isEmpty()) {
				return res.status(422).json({ errors: errors.array() });
			}
			let { code, user_info }= req.query
			let results = null
			user_info = JSON.parse(user_info)

			const opt = {
				url: config.CODE_URL,
				data: {
					grant_type: config.GRANT_TYPE,
					appid: config.APP_ID,
					secret: config.SECRET,
					js_code: code
				}
			}
			const newData = await fetch(opt)
			if(has(newData, 'errcode')){
				//正式返回
				res.status(200).send(jsonFormatter({ msg : newData.errmsg}, true));
			}else{
				const params = {
					openid: newData.openid,
					avatar_url: user_info.avatarUrl,
					nick_name: user_info.nickName,
				}
				results = await model.UserModel.findOne({ where: { openid: newData.openid }})
				if(!results) {
					results = await model.UserModel.create(params)
				}

				res.status(200).send(jsonFormatter({ res : results}));
			}

			

		}catch(error){
			res.status(200).send(jsonFormatter({ msg : '未知的错误'}, true));
			Logger.error(error)
		}
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
			const data = getDataFromReq(req)
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


export default new UserCtl()