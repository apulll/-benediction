/*
* @Author: perry
* @Date:   2018-03-14 10:19:45
* @Last Modified by:   perry
* @Last Modified time: 2018-03-19 14:59:57
*/
import Controller from './index.js';
import model from '../models';
import { jsonFormatter, getDataFromReq } from '../lib';
const Logger = require('../lib/logger')('controllers/template');

class TemplateCtl extends Controller {
	constructor() {
		super();
		
	}
	async getTemplateAll(req, res, next) {
		try {
			const results = await model.TemplateModel.findAll({ raw: true});
			res.status(200).send(jsonFormatter({ res : results}));
		}catch(error){
			Logger.error(error)
		}
	}
	/**
	 * 创建模板
	 * @param  {[type]}   req  [description]
	 * @param  {[type]}   res  [description]
	 * @param  {Function} next [description]
	 * @return {[type]}        [description]
	 */
	async createTemplate(req, res, next) {
		try {

			const data = getDataFromReq(req)
			const params = {
				catalog_id: data.catalog_id,
				bg_img: data.bg_img,
				bg_imgsumb: data.bg_imgsumb
			}

			var results = await model.TemplateModel.create(params);

			res.status(200).send(jsonFormatter({ res : results}));
		}catch(error){
			Logger.error(error)
		}
	}
	/**
	 * 更新模板
	 * @param  {[type]}   req  [description]
	 * @param  {[type]}   res  [description]
	 * @param  {Function} next [description]
	 * @return {[type]}        [description]
	 */
	async update(req, res, next) {
		try {

			const data = getDataFromReq(req)
			const { id } = req.params
			console.log(data, req.params)
			const params = {
				catalog_id: data.catalog_id,
				bg_img: data.bg_img,
				bg_imgsumb: data.bg_imgsumb
			}
			const catResults = await model.CatalogModel.findById(id)
			if(catResults){
				var results = await model.TemplateModel.update(params,{
					where: {
		        id: 15
		      }
				});
			}else{
				res.status(200).send(jsonFormatter({ msg : '分类不存在，请先创建分类'}, true));
			}
			res.status(200).send(jsonFormatter({ res : results}));
		}catch(error){
			Logger.error(error)
		}
	}
}


export default new TemplateCtl()
