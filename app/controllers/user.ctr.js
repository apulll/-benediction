/*
* @Author: perry
* @Date:   2018-03-14 10:19:45
* @Last Modified by:   perry
* @Last Modified time: 2018-03-14 15:34:00
*/
import Controller from './index.js';
import { UserModel } from '../models';
import { jsonFormatter } from '../lib';

class UserCtl extends Controller {
	constructor() {
		super();
		
	}
	async getUserAll(req, res, next) {
		const results = await UserModel.findAll({ raw: true});
		res.status(200).send(jsonFormatter({ res : results}));
	}
}


export default new UserCtl()