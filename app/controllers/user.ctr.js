/*
* @Author: perry
* @Date:   2018-03-14 10:19:45
* @Last Modified by:   perry
* @Last Modified time: 2018-03-19 16:53:59
*/
import Controller from './index.js';
import model from '../models';
import { jsonFormatter, getDataFromReq } from '../lib';
import fetch from '../lib/fetch';
import config from '../config';

const Logger = require('../lib/logger')('controllers/user');

class UserCtl extends Controller {
	constructor() {
		super();
		
	}
	async getUserAll(req, res, next) {
		const results = await UserModel.findAll({ raw: true});
		res.status(200).send(jsonFormatter({ res : results}));
	}
	/**
	 * 小程序用户登录
	 * @param  {[type]}   req  [description]
	 * @param  {[type]}   res  [description]
	 * @param  {Function} next [description]
	 * @return {[type]}        [description]
	 */
	async onLogin(req, res, next) {
		try {
			let { code, userInfo }= req.query
			let results = null
			userInfo = JSON.parse(userInfo)
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
			if(newData){
				const params = {
					openid: newData.openid,
					avatar_url: userInfo.avatarUrl,
					nick_name: userInfo.nickName,
				}
				results = await model.UserModel.findOne({ where: { openid: newData.openid }})
				if(!results) {
					results = await model.UserModel.create(params)
				}
			}
			
			res.status(200).send(jsonFormatter({ res : results}));

		}catch(error){
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
		}
		
	}
}


export default new UserCtl()