/*
* @Author: perry
* @Date:   2018-03-14 10:57:49
* @Last Modified by:   perry
* @Last Modified time: 2018-03-16 15:18:22
*/

const _ = require('lodash');

exports.jsonFormatter = function(response, err = false, code = 200) {
	return {
		res: response.res || {},
		msg: response.msg || '成功！',
		errors: response.errors || [],
		status: !err,
		code
  }
}

exports.getDataFromReq = function(req) {
	const data  = (req.method === 'GET' || req.method === 'DELETE')  ? req.query : req.body
	return data
}

exports.formatDataByCatalogId = function(results) {
	const data = JSON.parse(JSON.stringify(results))
	console.log(data[0],'data')
	const arrs = data[0].templates
	const template_ids = _.map(arrs, 'id');

	return template_ids
}

exports.formatPage = function(page=1, per_page=10, results) {
	const data = results.rows
	const total = results.count
	const newObj = {
		data,
		total,
		page,
		per_page
	}

	return newObj;
}