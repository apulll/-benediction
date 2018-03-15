/*
* @Author: perry
* @Date:   2018-03-14 10:19:45
* @Last Modified by:   perry
* @Last Modified time: 2018-03-15 18:18:33
*/
import Controller from './index.js';
import model from '../models';
import { jsonFormatter, getDataFromReq } from '../lib';
import fetch from '../lib/fetch';

class UserCtl extends Controller {
	constructor() {
		super();
		
	}
	async getUserAll(req, res, next) {
		const results = await UserModel.findAll({ raw: true});
		res.status(200).send(jsonFormatter({ res : results}));
	}
	async onLogin(req, res, next) {
		let { code, userInfo }= req.query
		let results = null
		userInfo = JSON.parse(userInfo)
		const opt = {
			url:'https://api.weixin.qq.com/sns/jscode2session',
			data: {
				grant_type: 'authorization_code',
				appid: 'wx8276fe97311f08fc',
				secret: '217676207b5ad04146995dbdab6e4602',
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
	}
}


export default new UserCtl()