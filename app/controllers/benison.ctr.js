/*
* @Author: perry
* @Date:   2018-03-14 10:19:45
* @Last Modified by:   perry
* @Last Modified time: 2018-03-14 18:23:17
*/
import Controller from './index.js';
import model from '../models';
import { jsonFormatter, getDataFromReq } from '../lib';

class BenisonCtl extends Controller {
	constructor() {
		super();
		
	}
	async getBenisonAll(req, res, next) {
		const results = await model.BenisonModel.findAll({ raw: true});
		res.status(200).send(jsonFormatter({ res : results}));
	}
	//创建祝福语
	async createBenison(req, res, next) {
		const data = getDataFromReq(req)
		const params = {
			benisons_txt: data.benisons_txt,
			is_belong_template: data.is_belong_template,
			template_id: data.template_id
		}

		var results = await model.BenisonModel.create(params);

		res.status(200).send(jsonFormatter({ res : results}));
	}
}


export default new BenisonCtl()