/*
* @Author: perry
* @Date:   2018-03-14 10:19:45
* @Last Modified by:   perry
* @Last Modified time: 2018-03-20 13:44:31
*/

import Controller from './index.js';
import model from '../models';
import { jsonFormatter, getDataFromReq, formatPage } from '../lib';
import validatorForm from '../lib/validator';
import config from '../config';
import { cos, qcloud_cod } from '../lib/upload';
const path = require('path');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const Logger = require('../lib/logger')('controllers/common');
const { check,validationResult } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');

class CommonCtr extends Controller {
	constructor() {
		super();
		this.uploadQcloud = this.uploadQcloud.bind(this)
		this.uploadImg = this.uploadImg.bind(this)
	}
	async uploadImg(req, res, next){
		const _this = this;
		const files = req.files;
		
		files.map(function(file){
				const response = _this.uploadQcloud(file)
				if(response) return;

		})
		res.status(200).send('jsonFormatter({ res : newResults})');
	}

	async uploadQcloud(file){
		Logger.debug(file);
		var params = {
	    Bucket : `${config.QCLOUD_BUCKET}-${config.QCLOUD_APPID}`,                        
	    Region : config.QCLOUD_REGION,                        
	    Key : file.filename, 
	    FilePath:  path.resolve(config.ROOT_DIR, file.path)                         
		};

		cos.sliceUploadFile(params, async function(err, data) {
    if(err) {
    			return null;
          Logger.error(err);
		    } else {
		    	const params = {
		    		file_name: file.filename,
		    		file_size: file.size,
		    		file_type: file.mimetype,
		    	}
		    	const results = await model.FileModel.create(params);
		    	Logger.info(results);
		    	return results
		      Logger.info(data);
		    }
		});
		// console.log(results,'results')
	}

}



export default new CommonCtr()