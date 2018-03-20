/*
* @Author: perry
* @Date:   2018-03-14 10:19:45
* @Last Modified by:   perry
* @Last Modified time: 2018-03-20 16:46:59
*/

import Controller from './index.js';
import model from '../models';
import { jsonFormatter, getDataFromReq, formatPage } from '../lib';
import validatorForm from '../lib/validator';
import config from '../config';
import { cos, qcloud_cod } from '../lib/upload';
var Promise = require("bluebird");
const path = require('path');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const Logger = require('../lib/logger')('controllers/common');
const { check,validationResult } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');

var cosAsync = Promise.promisifyAll(cos);

class CommonCtr extends Controller {
	constructor() {
		super();
		this.uploadQcloud = this.uploadQcloud.bind(this)
		this.uploadImg = this.uploadImg.bind(this)
	}
	/**
	 * 多文件上传 暂时有问题
	 * @param  {[type]}   req  [description]
	 * @param  {[type]}   res  [description]
	 * @param  {Function} next [description]
	 * @return {[type]}        [description]
	 */
	async uploadImg(req, res, next){
		const _this = this;
		const files = req.files;
		let newFiles = []
		Logger.debug(req)
		// Promise.map(files).then(function(file){
		// 	console.log(file,'file111')
		// })
		files.map(function(file){
				const response = _this.uploadQcloud(file)
				console.log(response,'response11111')
				if(response){
					newFiles.push(response)
				}
			// console.log(newFiles)

		})
		console.log(newFiles,'newFiles')
		Logger.debug(newFiles,'newFiles')
		res.status(200).send('jsonFormatter({ res : newResults})');
	}

	uploadQcloud(file){
		
		var params = {
	    Bucket : `${config.QCLOUD_BUCKET}-${config.QCLOUD_APPID}`,                        
	    Region : config.QCLOUD_REGION,                        
	    Key : file.filename, 
	    FilePath:  path.resolve(process.cwd(), file.path)                         
		};
		
		cosAsync.sliceUploadFileAsync(params).then(function(res){
				return Promise.resolve(res)
		}).catch(function(error){
				return Promise.reject(error)
		})
			
			
		
	}
	/**
	 * 文件上传，不仅有文件 还有其他的参数传进来的情况
	 * @param  {[type]}   req  [description]
	 * @param  {[type]}   res  [description]
	 * @param  {Function} next [description]
	 * @return {[type]}        [description]
	 */
	async upload(req, res, next) {
		const _this = this;
		const files = req.files;
		Logger.debug(req.body)
		files.map(function(file){
				const response = _this.uploadQcloud(file)
				// if(response) return;

		})
		res.status(200).send('jsonFormatter({ res : newResults})');
	}

}



export default new CommonCtr()