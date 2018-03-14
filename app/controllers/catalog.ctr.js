/*
* @Author: perry
* @Date:   2018-03-14 10:19:45
* @Last Modified by:   perry
* @Last Modified time: 2018-03-14 17:00:59
*/
import Controller from './index.js';
import model from '../models';
import { jsonFormatter } from '../lib';

class CatalogCtl extends Controller {
	constructor() {
		super();
		
	}
	async getCatalogAll(req, res, next) {
		const results = await model.CatalogModel.findAll({ raw: true});
		res.status(200).send(jsonFormatter({ res : results}));
	}
	//创建分类
	async createCatalog(req, res, next) {
		console.log(req.body,'method')
		const data = (req.method === 'get' || req.method === 'delete')  ? req.query : req.body
		const params = {
			catalog_name: data.catalog_name,
			catalog_icon: data.catalog_icon,
			catalog_bg: data.catalog_bg
		}

		var results = await model.CatalogModel.create(params);

		res.status(200).send(jsonFormatter({ res : results}));
	}
}


export default new CatalogCtl()
