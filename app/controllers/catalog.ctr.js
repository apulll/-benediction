/*
* @Author: perry
* @Date:   2018-03-14 10:19:45
* @Last Modified by:   perry
* @Last Modified time: 2018-03-16 15:08:33
*/
import Controller from './index.js';
import model from '../models';
import { jsonFormatter, getDataFromReq, formatDataByCatalogId } from '../lib';
const Logger = require('../lib/logger')('controllers/catalog');

class CatalogCtl extends Controller {
	constructor() {
		super();
	}
	async getCatalogAll(req, res, next) {
		const results = await model.CatalogModel.findAll({ raw: true});
		res.status(200).send(jsonFormatter({ res : results}));
	}
	/**
	 * 创建分类
	 * @param  {[type]}   req  [description]
	 * @param  {[type]}   res  [description]
	 * @param  {Function} next [description]
	 * @return {[type]}        [description]
	 */
	async createCatalog(req, res, next) {
		try {
			
			const data = getDataFromReq(req)
			const params = {
				catalog_name: data.catalog_name,
				catalog_icon: data.catalog_icon,
				catalog_bg: data.catalog_bg
			}

			var results = await model.CatalogModel.create(params);

			res.status(200).send(jsonFormatter({ res : results}));
		}catch(error){
			Logger.error(error)
		}
	}
	//根据模板id获取所有祝福
	async getBenisonAllByTemplateId(req, res , next) {
		const data = getDataFromReq(req)
		const results  = await model.BenisonModel.findAll({
							where: { template_id: data.templateIds },
							order: [['updated_at', 'DESC']]
						})
		res.status(200).send(jsonFormatter({ res : results}));
	}
}


export default new CatalogCtl()
