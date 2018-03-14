/*
* @Author: perry
* @Date:   2018-03-14 10:19:45
* @Last Modified by:   perry
* @Last Modified time: 2018-03-14 18:00:01
*/
import Controller from './index.js';
import model from '../models';
import { jsonFormatter, getDataFromReq } from '../lib';

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
		const data = getDataFromReq(req)
		const params = {
			catalog_name: data.catalog_name,
			catalog_icon: data.catalog_icon,
			catalog_bg: data.catalog_bg
		}

		var results = await model.CatalogModel.create(params);

		res.status(200).send(jsonFormatter({ res : results}));
	}
	//根据分类id获取所有分类下的祝福
	async getBenisonAll(req, res, next) {
		const data = getDataFromReq(req)
		const params = {
			catalog_id: data.catalog_id
		}
		var templates = await model.CatalogModel.findAll({ include: [{
							model: model.TemplateModel,
							where: { catalog_id: data.catalog_id }

						}]});
		res.status(200).send(jsonFormatter({ res : templates}));
	}
}


export default new CatalogCtl()
