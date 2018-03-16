/*
* @Author: perry
* @Date:   2018-03-14 10:19:45
* @Last Modified by:   perry
* @Last Modified time: 2018-03-16 16:26:15
*/

import Controller from './index.js';
import model from '../models';
import { jsonFormatter, getDataFromReq, formatPage } from '../lib';
import validatorForm from '../lib/validator';
import config from '../config';

const Logger = require('../lib/logger')('controllers/benison');
const { check,validationResult } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');

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
		Logger.info(config,'config')
		try {
			const data = getDataFromReq(req)
			const per_page = parseInt(data.per_page) || 10
			const page = parseInt(data.page) || 1

			const results  = await model.BenisonModel.findAndCountAll({
								order: [['updated_at', 'DESC']],
								limit: per_page,
								offset: per_page*(page-1),
								where: { is_belong_template : data.is_belong_template },
								// logging: console.log,
								benchmark:true,
								include: [{
									model: model.TemplateModel,
									required: true,
									include:[
									 data.catalog_id !== '0' ? { model:model.CatalogModel, required: true, where:{ id: data.catalog_id }}
									 :{ model:model.CatalogModel, required: true}
									]
								},{
									model: model.UserModel,
									required: true,
								}
								]
							})
			const newResults = formatPage(page, per_page, results)
			res.status(200).send(jsonFormatter({ res : newResults}));

		}catch(error){
			Logger.error(error)
		}
	}
	/**
	 * 创建祝福语
	 * @param  {[type]}   req  [description]
	 * @param  {[type]}   res  [description]
	 * @param  {Function} next [description]
	 * @return {[type]}        [description]
	 */
	async createBenison(req, res, next) {
		try {

			const errors = validatorForm(req);
			if (!errors.isEmpty()) {
				return res.status(422).json({ errors: errors.array() });
			}

			const data = getDataFromReq(req)
			const params = {
				benisons_txt: data.benisons_txt,
				is_belong_template: data.is_belong_template,
				password: data.password,
				template_id: data.template_id , //必填
				user_id: data.user_id // 必填
			}
			const temp_res = await model.TemplateModel.findById(data.template_id)
			const user_res = await model.UserModel.findById(data.user_id)

			if(!temp_res) {
				res.status(200).send(jsonFormatter({ msg : '模板不存在'}, true));
			}else if(!user_res) {
				res.status(200).send(jsonFormatter({ msg : '用户不存在'}, true));
			}else {
				const results = await model.BenisonModel.create(params);
				res.status(200).send(jsonFormatter({ res : results}));
			}

		}catch(error){
			Logger.error(error)
		}
	}
	/**
	 * 祝福语详情
	 * @param  {[type]}   req  [description]
	 * @param  {[type]}   res  [description]
	 * @param  {Function} next [description]
	 * @return {[type]}        [description]
	 */
	async getBenisonDetail(req, res, next) {

		try {

			const data = getDataFromReq(req)
			
			// var results = await model.BenisonModel.create(params);
			var results = await model.BenisonModel.findAll({
							where: { id: data.benison_id },
							benchmark:true,
							include: [{
								model: model.TemplateModel,
								// where: { id: data.template_id },
								include:[
									{
										model:model.CatalogModel
									}
								]
							},
							{
								model: model.UserModel,
								required: true,
							}
							]
						});
			res.status(200).send(jsonFormatter({ res : results}));

		}catch(error){
			Logger.error(error)
		}
	}
}

export default new BenisonCtl()