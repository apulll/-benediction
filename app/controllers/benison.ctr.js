/*
* @Author: perry
* @Date:   2018-03-14 10:19:45
* @Last Modified by:   perry
* @Last Modified time: 2018-03-15 14:18:14
*/
import Controller from './index.js';
import model from '../models';
import { jsonFormatter, getDataFromReq, formatPage } from '../lib';

class BenisonCtl extends Controller {
	constructor() {
		super();
		
	}
	/**
	 * 根据分类id获取所有分类下的祝福
	 * @param  {[type]}   req  [description]
	 * @param  {[type]}   res  [description]
	 * @param  {Function} next [description]
	 * @return {[type]}        [description]
	 */
	async getBenisonAll(req, res, next) {
		const data = getDataFromReq(req)
		const per_page = parseInt(data.per_page) || 10
		const page = parseInt(data.page) || 1

		const results  = await model.BenisonModel.findAndCountAll({
							order: [['updated_at', 'DESC']],
							limit: per_page,
							offset: per_page*(page-1),
							include: [{
								model: model.TemplateModel,
								required: true,
								include:[
								 data.catalog_id !== '0' ? { model:model.CatalogModel, required: true, where:{ id: data.catalog_id }}
								 :{ model:model.CatalogModel, required: true}
								]
							}]
						})
		const newResults = formatPage(page, per_page, results)
		res.status(200).send(jsonFormatter({ res : newResults}));
	}
	/**
	 * 创建祝福语
	 * @param  {[type]}   req  [description]
	 * @param  {[type]}   res  [description]
	 * @param  {Function} next [description]
	 * @return {[type]}        [description]
	 */
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
	/**
	 * 祝福语详情
	 * @param  {[type]}   req  [description]
	 * @param  {[type]}   res  [description]
	 * @param  {Function} next [description]
	 * @return {[type]}        [description]
	 */
	async getBenisonDetail(req, res, next) {
		const data = getDataFromReq(req)
		const params = {
			benisons_id: data.benison_id,
			template_id: data.template_id
		}

		// var results = await model.BenisonModel.create(params);
		var results = await model.BenisonModel.findAll({
						where: { id: data.benison_id },
						benchmark:true,
						include: [{
							model: model.TemplateModel,
							where: { id: data.template_id },
							include:[
								{
									model:model.CatalogModel
								}
							]
						}]});
		res.status(200).send(jsonFormatter({ res : results}));
	}
}


export default new BenisonCtl()