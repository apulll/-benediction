/*
* @Author: perry
* @Date:   2018-03-14 10:19:45
* @Last Modified by:   perry
* @Last Modified time: 2018-03-14 15:24:43
*/
import Controller from './index.js';
import { BenisonModel } from '../models';
import { jsonFormatter } from '../lib';

class BenisonCtl extends Controller {
	constructor() {
		super();
		
	}
	async getBenisonAll(req, res, next) {
		const results = await BenisonModel.findAll({ raw: true});
		res.status(200).send(jsonFormatter({ res : results}));
	}
}


export default new BenisonCtl()