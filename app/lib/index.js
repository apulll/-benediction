/*
* @Author: perry
* @Date:   2018-03-14 10:57:49
* @Last Modified by:   perry
* @Last Modified time: 2018-03-28 11:59:15
*/

const _ = require('lodash');

exports.jsonFormatter = function(response, err = false, code = 200) {
	return {
		res: response.res || null,
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
/**
 * 获取祝福列表页时数据处理
 * @param  {[type]} resource [description]
 * @param  {[type]} target   [description]
 * @return {[type]}          [description]
 */
exports.benisonAllDataFormat = function(resource, target){
	let newRecource = {}
	let newRows = _.cloneDeep(resource.rows)
	newRows = _.map(newRows, function(value, key) {
		console.log(value.id, 'value')
		let newObj = _.cloneDeep(value)
			newObj = _.assign({}, newObj, {is_liked_bension:0})
			_.map(target, function(value2, key2) {
			  if(value.id == value2.bension_id) {
			  	newObj = _.assign({}, newObj, {is_liked_bension:value2.is_liked_bension})
			  }
			});
			
		return newObj
	});
	newRecource = {
		count: resource.count,
		rows: newRows
	}
	return newRecource
}