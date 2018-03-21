/*
* @Author: perry
* @Date:   2018-03-14 10:19:45
* @Last Modified by:   perry
* @Last Modified time: 2018-03-21 13:54:01
*/
import Controller from './index.js';
import model from '../models';
import { jsonFormatter, getDataFromReq } from '../lib';
import fetch from '../lib/fetch';
import config from '../config';
import { has } from 'lodash';
import validatorForm from '../lib/validator';

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


			console.log(req.query,'query')
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
				results = {
		        "id": 12,
		        "openid": "oxDF35OkQRrDdkCMFkIk2B1y_-00",
		        "avatar_url": "https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTJLk1UQL99icicEPKD8kgEJDuSjFiceQ4vI5DgomWvjuy2eaYUhRbs3bO3KEUOqqk803wTjC0k2mP5uw/0",
		        "nick_name": "塞纳河畔",
		        "created_at": "2018-03-15T10:14:51.000Z",
		        "updated_at": "2018-03-15T10:14:51.000Z"
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
		}
		
	}
}


export default new UserCtl()