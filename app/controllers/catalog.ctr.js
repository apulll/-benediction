/*
* @Author: perry
* @Date:   2018-03-14 10:19:45
* @Last Modified by:   perry
* @Last Modified time: 2018-03-21 17:28:57
*/
import Controller from './index.js';
import model from '../models';
import { jsonFormatter, getDataFromReq, formatDataByCatalogId } from '../lib';
const Logger = require('../lib/logger')('controllers/catalog');

class CatalogCtl extends Controller {
	constructor() {
		super();
	}
	/**
	 * 获取所有分类
	 * @param  {[type]}   req  [description]
	 * @param  {[type]}   res  [description]
	 * @param  {Function} next [description]
	 * @return {[type]}        [description]
	 */
	async getCatalogAll(req, res, next) {
		try{
			const results = await model.CatalogModel.findAll({ raw: true});
			res.status(200).send(jsonFormatter({ res : results}));
		}catch(error){
			Logger.error(error)
			res.status(200).send(jsonFormatter({ msg : "获取列表异常"+error},true));
		}
		
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
			res.status(200).send(jsonFormatter({ msg : "写入数据异常"+error},true));
		}
	}
	
}


export default new CatalogCtl()
